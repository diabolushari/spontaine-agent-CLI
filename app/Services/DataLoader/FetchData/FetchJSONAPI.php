<?php

namespace App\Services\DataLoader\FetchData;

use App\Services\NetSuiteAuth\NetSuiteRestletClient;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class FetchJSONAPI implements FetchDataInterface
{
    private ?string $url = null;

    private ?string $method = null;

    private ?string $sdk = null;

    /** @var array<string, mixed> */
    private array $body = [];

    /** @var array<string, string> */
    private array $headers = [];

    public function __construct(
        private NetSuiteRestletClient $restletClient
    ) {}

    /**
     * @throws GuzzleException
     * @throws Exception
     */
    public function getData(): array
    {
        if ($this->url == null) {
            throw new Exception('URL is not set');
        }
        if ($this->method == null) {
            throw new Exception('Method is not set');
        }

        // Special handling for NetSuite SDK
        if ($this->sdk === 'netsuite') {
            return $this->handleNetSuiteRequest();
        }

        $client = new Client;

        $options = [
            'headers' => $this->headers,
        ];

        if ($this->method == 'POST') {
            $contentType = strtolower($this->headers['Content-Type'] ?? 'application/json');
            if ($contentType == 'application/json') {
                $options['json'] = $this->body;
            }
            if ($contentType == 'application/x-www-form-urlencoded') {
                $options['form_params'] = $this->body;
            }
            if ($contentType == 'multipart/form-data') {
                $options['multipart'] = $this->body;
            }
        }

        if ($this->method == 'GET') {
            $options['query'] = $this->body;
        }

        $response = $client->request(
            $this->method,
            $this->url,
            $options
        );

        return json_decode($response->getBody()->getContents(), true);
    }

    /**
     * Parse NetSuite RESTlet URL and call the NetSuiteRestletClient
     *
     * @throws Exception
     */
    private function handleNetSuiteRequest(): array
    {
        $parsedUrl = parse_url($this->url);
        parse_str($parsedUrl['query'] ?? '', $queryParams);

        $scriptId = $queryParams['script'] ?? null;
        $deployId = $queryParams['deploy'] ?? null;

        if (! $scriptId || ! $deployId) {
            throw new Exception('NetSuite RESTlet URL must contain script and deploy parameters');
        }

        // Remove script and deploy from query params to avoid passing them twice
        unset($queryParams['script'], $queryParams['deploy']);

        // Merge URL query params with the provided body/params
        $allParams = array_merge($queryParams, $this->body);

        return $this->restletClient->call(
            $this->method,
            (string) $scriptId,
            (string) $deployId,
            $allParams
        );
    }

    public function setUrl(string $url): self
    {
        $this->url = $url;

        return $this;
    }

    public function setMethod(string $method): self
    {
        $this->method = $method;

        return $this;
    }

    /**
     * @param  array<string, mixed>  $body
     * @return $this
     */
    public function setBody(array $body): self
    {
        $this->body = $body;

        return $this;
    }

    /**
     * @param  array<string, string>  $headers
     * @return $this
     */
    public function setHeaders(array $headers): self
    {
        $this->headers = $headers;

        return $this;
    }

    public function setSdk(?string $sdk): self
    {
        $this->sdk = $sdk;

        return $this;
    }
}
