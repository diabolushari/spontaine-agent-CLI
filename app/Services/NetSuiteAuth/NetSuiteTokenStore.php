<?php

namespace App\Services\NetSuiteAuth;

use Illuminate\Support\Carbon;
use App\Models\SdkToken;

class NetSuiteTokenStore
{
    /**
     * Create a new token record in sdk_tokens.
     */
    public function store(
        string $token,
        int $expiresAt,
        string $sdk = 'netsuite',
        string $tokenKey = 'm2m_access_token'
    ): void {
        SdkToken::create([
            'sdk' => $sdk,
            'token_key' => $tokenKey,
            'token' => $token,
            'expires_at' => Carbon::createFromTimestamp($expiresAt),
        ]);
    }

    /**
     * Update an existing token record by ID.
     */
    public function update(int $id, string $token, int $expiresAt): void
    {
        SdkToken::where('id', $id)->update([
            'token' => $token,
            'expires_at' => Carbon::createFromTimestamp($expiresAt),
        ]);
    }

    /**
     * Return a valid (non-expired) token string, or null.
     */
    public function retrieveValidToken(): ?string
    {
        $tokenRecord = $this->findTokenRecord();

        return $tokenRecord;
    }

    /**
     * Find the token record regardless of expiry.
     */
    public function findTokenRecord(string $sdk = 'netsuite', string $tokenKey = 'm2m_access_token'): ?SdkToken
    {
        return SdkToken::where('sdk', $sdk)
            ->where('token_key', $tokenKey)
            ->first();
    }
}
