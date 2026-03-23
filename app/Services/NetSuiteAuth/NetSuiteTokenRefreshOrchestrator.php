<?php

namespace App\Services\NetSuiteAuth;

use Illuminate\Support\Facades\Cache;

class NetSuiteTokenRefreshOrchestrator
{
    public function __construct(
        private NetSuiteJwtAssertionFactory $assertionFactory,
        private NetSuiteTokenHttpClient $httpClient,
        private NetSuiteTokenStore $tokenStore
    ) {
    }

    public function getAccessToken(
        string $consumerKey,
        string $certificateId,
        string $accountId,
        string $privateKey,
        array $scope = ['restlets', 'rest_webservices']
    ): string {
        $tokenRecord = $this->tokenStore->findTokenRecord();

        // Token exists and is still valid (more than 5 min remaining)
        if ($tokenRecord && $tokenRecord->expires_at && $tokenRecord->token) {
            if (now()->lessThan($tokenRecord->expires_at->subSeconds(300))) {
                return (string) $tokenRecord->token;
            }
        }

        // Token is missing or about to expire — acquire lock before refreshing
        $lock = Cache::lock('netsuite_token_refresh', 30);

        return $lock->block(10, function () use ($consumerKey, $certificateId, $accountId, $privateKey, $scope) {
            // Re-check after acquiring lock — another process may have already refreshed
            $tokenRecord = $this->tokenStore->findTokenRecord();

            if ($tokenRecord && $tokenRecord->expires_at && $tokenRecord->token) {
                if (now()->lessThan($tokenRecord->expires_at->subSeconds(300))) {
                    return (string) $tokenRecord->token;
                }
            }

            // Still expired/missing — proceed with refresh
            $assertion = $this->assertionFactory->build(
                $consumerKey,
                $certificateId,
                $accountId,
                $privateKey,
                $scope
            );

            $issuedData = $this->httpClient->issueAccessToken($assertion, $accountId);

            if ($tokenRecord) {
                $this->tokenStore->update(
                    (int) $tokenRecord->id,
                    $issuedData['access_token'],
                    $issuedData['expires_at']
                );
            } else {
                $this->tokenStore->store(
                    $issuedData['access_token'],
                    $issuedData['expires_at']
                );
            }

            return $issuedData['access_token'];
        });
    }
}
