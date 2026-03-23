<?php

namespace App\Services\NetSuiteAuth;

use Illuminate\Support\Facades\Http;

class NetSuiteRestletClient
{
    public function __construct(
        private NetSuiteTokenRefreshOrchestrator $tokenOrchestrator
    ) {
    }

    /**
     * Call a NetSuite RESTlet endpoint with automatic token management.
     *
     * @param  string  $method     HTTP method (GET, POST, PUT, DELETE)
     * @param  string  $scriptId   RESTlet script ID
     * @param  string  $deployId   RESTlet deploy ID
     * @param  array   $params     Query parameters (for GET) or body payload (for POST/PUT)
     * @return array
     */
    public function call(string $method, string $scriptId, string $deployId, array $params = []): array
    {
        $config = config('services.netsuite');

        $accessToken = $this->tokenOrchestrator->getAccessToken(
            $config['consumer_key'],
            $config['certificate_id'],
            $config['account_id'],
            $config['private_key']
        );

        $accountIdLower = strtolower(str_replace('_', '-', $config['account_id']));
        $url = "https://{$accountIdLower}.restlets.api.netsuite.com/app/site/hosting/restlet.nl";

        $request = Http::withHeaders([
            'Authorization' => "Bearer {$accessToken}",
            'Content-Type'  => 'application/json',
            'Accept'        => 'application/json',
        ]);

        $query = [
            'script' => $scriptId,
            'deploy' => $deployId,
        ];

        $method = strtoupper($method);

        $response = match ($method) {
            'GET' => $request->get($url, array_merge($query, $params)),
            'POST' => $request->post($url . '?' . http_build_query($query), $params),
            'PUT' => $request->put($url . '?' . http_build_query($query), $params),
            'DELETE' => $request->delete($url . '?' . http_build_query($query), $params),
            default => throw new \InvalidArgumentException("Unsupported HTTP method: {$method}"),
        };

        if (!$response->successful()) {
            throw new \RuntimeException(
                "NetSuite RESTlet call failed [{$response->status()}]: " . $response->body()
            );
        }

        return $response->json() ?? [];
    }

    /**
     * Shorthand: GET request to a RESTlet.
     */
    public function get(string $scriptId, string $deployId, array $params = []): array
    {
        return $this->call('GET', $scriptId, $deployId, $params);
    }

    /**
     * Shorthand: POST request to a RESTlet.
     */
    public function post(string $scriptId, string $deployId, array $data = []): array
    {
        return $this->call('POST', $scriptId, $deployId, $data);
    }
}
