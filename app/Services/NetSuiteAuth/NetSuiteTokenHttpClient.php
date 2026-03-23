<?php

namespace App\Services\NetSuiteAuth;

use GuzzleHttp\Client;

class NetSuiteTokenHttpClient
{
    /**
     * Algorithm B: Issue Access Token
     */
    public function issueAccessToken(string $clientAssertion, string $accountId): array
    {
        $accountIdLower = strtolower(str_replace('_', '-', $accountId));
        $tokenEndpoint = "https://{$accountIdLower}.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token";

        $client = new Client();
        $response = $client->post($tokenEndpoint, [
            'form_params' => [
                'grant_type' => 'client_credentials',
                'client_assertion_type' => 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                'client_assertion' => $clientAssertion,
            ],
            'http_errors' => false,
        ]);

        if ($response->getStatusCode() !== 200) {
            throw new \RuntimeException("TokenIssuanceException: Failed to issue access token. Response: " . $response->getBody()->getContents());
        }

        $data = json_decode($response->getBody()->getContents(), true);

        return [
            'access_token' => $data['access_token'],
            'expires_in' => (int) $data['expires_in'],
            'expires_at' => time() + (int) $data['expires_in'],
        ];
    }
}
