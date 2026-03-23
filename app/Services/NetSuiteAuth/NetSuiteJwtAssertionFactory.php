<?php

namespace App\Services\NetSuiteAuth;

use Illuminate\Support\Str;
use phpseclib3\Crypt\RSA;

class NetSuiteJwtAssertionFactory
{
    /**
     * Algorithm A: Build JWT Client Assertion
     * Inspired by Postman JS Script snippet
     */
    public function build(
        string $consumerKey,
        string $certificateId,
        string $accountId,
        string $privateKeyStr,
        array $scope = ['restlets', 'rest_webservices']
    ): string {
        $accountIdLower = strtolower(str_replace('_', '-', $accountId));
        $audience = "https://{$accountIdLower}.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token";
        
        $issuedAt = time();
        $expiresAt = $issuedAt + 3600; // 1 hour validity

        $header = [
            'alg' => 'PS256',
            'typ' => 'JWT',
            'kid' => $certificateId,
        ];

        $payload = [
            'iss' => $consumerKey,
            'scope' => $scope,
            'aud' => $audience,
            'iat' => $issuedAt,
            'exp' => $expiresAt,
            'jti' => Str::uuid()->toString(),
        ];

        return $this->signJwt($header, $payload, $privateKeyStr);
    }

    private function signJwt(array $header, array $payload, string $privateKeyStr): string
    {
        $segments = [];
        $segments[] = $this->base64UrlEncode(json_encode($header));
        $segments[] = $this->base64UrlEncode(json_encode($payload));
        
        $signingInput = implode('.', $segments);
        
        $privateKey = RSA::load($privateKeyStr)
            ->withPadding(RSA::SIGNATURE_PSS)
            ->withHash('sha256');

        $signature = $privateKey->sign($signingInput);
        
        $segments[] = $this->base64UrlEncode($signature);
        
        return implode('.', $segments);
    }

    private function base64UrlEncode(string $data): string
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }
}
