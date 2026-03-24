# 1. Document Metadata

| Field | Value |
| --- | --- |
| Module | NetSuite OAuth 2.0 M2M Token Management |
| Version | 1.0 |
| Author Role | Architecture |
| Technology Stack | Laravel 11.36, PHP 8.4, MySQL, Laravel Scheduler, Laravel HTTP Client |
| Development Phase | Development Ready |
| Target Environment | Server-side Laravel application in this repository |
| Spec Date | 2026-03-19 |

# 2. Executive Summary

This module establishes server-to-server authentication for NetSuite using OAuth 2.0 machine-to-machine (client credentials) flow. The Laravel application must acquire a NetSuite access token from `/services/rest/auth/oauth2/v1/token`, persist the latest token in `sdk_tokens`, and provide a reliable token provider for downstream NetSuite API calls.

The module exists to remove token-handling logic from individual API integrations and centralize credential management, token rotation, expiry checks, persistence, and failure handling. The implementation must run safely in scheduled workloads because the application is expected to call NetSuite every hour.

This spec also extends the existing `LoaderAPI` data-loader source so a loader API record can declare `sdk='netsuite'`. When that SDK is selected, the runtime must automatically attach `Authorization: Bearer <valid_netsuite_token>` before issuing the outbound request.

Important protocol note: NetSuite M2M does not use a reusable refresh token. The application must request a new access token from the same token endpoint whenever the current token is absent or near expiry. The schedule will therefore rotate the stored access token hourly.

# 3. System Context

## 3.1 Context Overview

Upstream and downstream systems:

- Upstream:
  - `.env` values providing `CERTIFICATE_ID` and `CONSUMER_KEY`
  - Additional NetSuite runtime configuration required for token generation
  - NetSuite certificate private key storage
- Module:
  - NetSuite OAuth 2.0 M2M token management
- Downstream:
  - Hourly NetSuite data sync jobs
  - Any internal service that calls NetSuite REST APIs
  - `sdk_tokens` persistence table
  - Application logging/monitoring

## 3.2 System Context Diagram

```text
.env / config
   |
   v
NetSuite Config + Private Key
   |
   v
JWT Assertion Builder
   |
   v
NetSuite Token Service
   |
   +--> NetSuite Token Endpoint
   |
   +--> sdk_tokens table
   |
   v
NetSuite API Client
   |
   v
Hourly Sync / Other NetSuite Consumers
```

## 3.3 Interaction Summary

1. Scheduler invokes token refresh workflow every hour.
2. Token workflow generates a signed JWT client assertion using the mapped certificate.
3. Application posts the assertion to the NetSuite token endpoint.
4. Access token and expiry are saved to `sdk_tokens`.
5. NetSuite API consumers load the token through a shared provider instead of reading `.env` directly.

# 4. Scope Definition

## 4.1 In Scope

- Add NetSuite configuration mapping in `config/services.php`.
- Add a persistent token model for `sdk_tokens`.
- Acquire NetSuite OAuth 2.0 M2M access token from `/services/rest/auth/oauth2/v1/token`.
- Persist the current token to `sdk_tokens`.
- Refresh the token on a fixed hourly schedule.
- Provide a reusable service for downstream NetSuite API calls to retrieve a valid token.
- Extend `loader_a_p_i_s` / `App\Models\DataLoader\LoaderAPI` with an `sdk` field.
- Automatically inject NetSuite bearer authentication into loader API requests when `sdk='netsuite'`.
- Implement expiry guard logic so API calls do not use stale tokens.
- Add feature/unit tests for token issuance, persistence, and scheduling behavior.

## 4.2 Out of Scope

- Full NetSuite business API integration beyond authentication scaffolding.
- NetSuite webhooks, SuiteScript, or authorization-code grant flow.
- UI for managing NetSuite credentials.
- Multi-account NetSuite tenancy.
- Certificate rotation automation inside NetSuite admin console.

## 4.3 Assumptions

- The integration targets a single NetSuite account.
- `CERTIFICATE_ID` and `CONSUMER_KEY` already exist in `.env`.
- A private key corresponding to the uploaded NetSuite certificate is available to the Laravel application.
- The application either already has `sdk_tokens` or will add it through an additive migration.
- The application scheduler is running continuously.
- NetSuite access tokens are valid for 3600 seconds and must be re-issued, not refreshed with a refresh token grant.

# 5. Domain Model

## 5.1 Entities

- `NetSuiteAccessToken`
  - Represents the active NetSuite bearer token stored in `sdk_tokens`.
- `NetSuiteTokenRequest`
  - Represents the outgoing token issuance request payload.
- `NetSuiteTokenResponse`
  - Represents the normalized response from NetSuite token endpoint.
- `NetSuiteApiClient`
  - Consumer-facing service that retrieves a valid token before making REST calls.
- `LoaderApiSdkBinding`
  - Declares whether a loader API record uses NetSuite-managed authentication.

## 5.2 Aggregates and Relationships

```text
NetSuiteIntegration
   |
   +-- NetSuiteAccessToken (stored in sdk_tokens)
   |
   +-- NetSuiteApiClient
```

## 5.3 Invariants

- Only one active row may exist for the logical token key used by the NetSuite integration.
- `sdk` must be `netsuite`.
- `token_key` must be deterministic and constant for this integration.
- `token` must never be null after a successful issuance.
- `expires_at` must always represent the actual token expiry timestamp returned by NetSuite.
- Consumers must not call NetSuite with a token that expires within the configured safety window.
- Any `LoaderAPI` record with `sdk='netsuite'` must receive a valid `Authorization` bearer header at request time.

# 6. Business Rules

| Rule ID | Description |
| --- | --- |
| BR-001 | NetSuite authentication must use OAuth 2.0 client credentials flow with JWT client assertion. |
| BR-002 | The token endpoint URL must be account-specific: `https://<account_id>.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token`. |
| BR-003 | The application must request a new access token whenever no stored token exists or the token is near expiry. |
| BR-004 | The system must persist the access token in `sdk_tokens` using `sdk='netsuite'`. |
| BR-005 | The system must update the same logical token row instead of inserting duplicate active rows for the same `sdk` and `token_key`. |
| BR-006 | The scheduler must invoke token rotation every hour. |
| BR-007 | Any NetSuite API client must resolve its bearer token through the shared token provider, not via direct DB queries or `.env`. |
| BR-008 | If token issuance fails, the existing unexpired token may still be used until its expiry; expired tokens must never be reused. |
| BR-009 | Secret material and raw private keys must never be written to application logs. |
| BR-010 | `CERTIFICATE_ID` and `CONSUMER_KEY` must be read via config, not by calling `env()` from service classes. |
| BR-011 | `loader_a_p_i_s` must support an `sdk` field so request behavior can be integration-aware. |
| BR-012 | If `LoaderAPI.sdk = 'netsuite'`, the request layer must inject `Authorization: Bearer <valid token>` automatically. |
| BR-013 | For `LoaderAPI.sdk = 'netsuite'`, manual `Authorization` header values stored in `headers` must not override the managed NetSuite bearer token. |
| BR-014 | For loader APIs where `sdk` is null or not `netsuite`, configured headers must be sent unchanged. |

# 7. Parameter Domains

| Domain Code | Domain Name | Values |
| --- | --- | --- |
| SDK_CODE | SDK Identifier | `netsuite` |
| TOKEN_KEY | Logical Token Key | `m2m_access_token` |
| TOKEN_SCOPE | NetSuite Scope | `rest_webservices` |
| ASSERTION_ALG | JWT Signing Algorithm | `PS256` preferred; alternative algorithms only if the mapped certificate requires it |
| EXPIRY_WINDOW | Token Refresh Guard | default `300` seconds |
| LOADER_API_SDK | Loader API SDK Binding | `netsuite`, `null` |

Usage notes:

- `SDK_CODE` and `TOKEN_KEY` must be constants in the integration layer.
- `EXPIRY_WINDOW` is not written to DB; it is a runtime comparison threshold.
- `ASSERTION_ALG` must be config-driven to support certificate-specific requirements.

# 8. Database Design

## 8.1 Primary Table

### `sdk_tokens`

| Column | Type | Null | Description |
| --- | --- | --- | --- |
| `id` | bigint unsigned | no | Primary key |
| `sdk` | varchar(100) | no | Integration namespace, fixed to `netsuite` |
| `token_key` | varchar(150) | no | Logical token identifier, fixed to `m2m_access_token` |
| `token` | text | no | Latest active NetSuite bearer token |
| `expires_at` | timestamp | no | UTC expiry time for the current token |
| `created_at` | timestamp | no | Timestamp of last successful issuance/persistence |

## 8.2 Indexing Strategy

- Primary key: `id`
- Unique index: `unique_sdk_tokens_sdk_token_key (sdk, token_key)`
- Optional secondary index: `index_sdk_tokens_expires_at (expires_at)` if operational queries need expiry scans

## 8.3 Persistence Pattern

- Use upsert semantics keyed by (`sdk`, `token_key`).
- On refresh:
  - overwrite `token`
  - overwrite `expires_at`
  - overwrite `created_at` with current timestamp

## 8.4 Migration Strategy

- If `sdk_tokens` does not exist, add a migration creating the exact columns above.
- If `sdk_tokens` exists but lacks the unique composite key, add a migration to enforce uniqueness.
- Do not add `updated_at` unless explicitly approved because the requested schema does not include it.

## 8.5 Related Table Change

### `loader_a_p_i_s`

Additive schema change:

| Column | Type | Null | Description |
| --- | --- | --- | --- |
| `sdk` | varchar(50) | yes | Optional integration binding; `netsuite` enables automatic bearer token injection |

Rules:

- `sdk` is nullable for generic APIs.
- If `sdk='netsuite'`, the runtime must source authentication from `sdk_tokens` through `NetSuiteTokenService`.
- Add index `index_loader_apis_sdk (sdk)` only if query/filter use cases justify it; it is not required for correctness.

# 9. Entity Relationship Model

```text
sdk_tokens
   |
   +-- logical owner: NetSuiteTokenStore service
   |
   +-- consumed by: NetSuiteTokenService
   |
   +-- consumed by: NetSuiteApiClient
   |
   +-- consumed by: LoaderAPI requests where sdk='netsuite'

loader_a_p_i_s
   |
   +-- optional sdk binding -> netsuite
```

Cardinality and ownership:

- One NetSuite integration owns one logical token row.
- One token row can be read by many downstream NetSuite API consumers.
- The token row is owned exclusively by the token refresh workflow for writes.

# 10. Service Architecture

## 10.1 Layer Diagram

```text
Scheduler / Command
   |
   v
NetSuiteTokenRefreshOrchestrator
   |
   +--> NetSuiteJwtAssertionFactory
   +--> NetSuiteTokenHttpClient
   +--> NetSuiteTokenStore
   |
   v
sdk_tokens

NetSuiteApiClient
   |
   v
NetSuiteTokenService
   |
   v
sdk_tokens / Token Endpoint
```

## 10.2 Architectural Principles

- HTTP transport concerns remain isolated from token persistence.
- JWT generation remains isolated from API client execution.
- Token consumers do not know how tokens are generated.
- Scheduler concerns remain outside the core token service.

# 11. Component Responsibilities

| Component | Class | Responsibility |
| --- | --- | --- |
| Config Mapping | `config/services.php` | Maps `.env` variables into `services.netsuite.*` |
| Token Model | `App\Models\SdkToken` | Eloquent mapping for `sdk_tokens` |
| JWT Builder | `App\Services\NetSuite\Auth\NetSuiteJwtAssertionFactory` | Creates signed JWT client assertion |
| HTTP Client | `App\Services\NetSuite\Auth\NetSuiteTokenHttpClient` | Calls NetSuite token endpoint |
| Token Store | `App\Services\NetSuite\Auth\NetSuiteTokenStore` | Reads/writes `sdk_tokens` |
| Token Service | `App\Services\NetSuite\Auth\NetSuiteTokenService` | Returns valid token, refreshes if needed |
| API Client | `App\Services\NetSuite\NetSuiteApiClient` | Performs authenticated NetSuite REST requests |
| Loader API Auth Decorator | `App\Services\DataLoader\Auth\LoaderApiAuthHeaderResolver` | Resolves effective outbound headers for loader APIs, including NetSuite bearer injection |
| Scheduler Command | `App\Console\Commands\RefreshNetSuiteTokenCommand` | Hourly token rotation entry point |
| Scheduler Registration | `routes/console.php` | Registers hourly execution and overlap controls |

# 12. Core Algorithms

## 12.1 Algorithm A: Build JWT Client Assertion

Inputs:

- `consumer_key`
- `certificate_id`
- `account_id`
- private key
- scope
- current timestamp

Outputs:

- Signed JWT assertion string

Pseudocode:

```text
audience = "https://{account_id}.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token"
issuedAt = now_utc()
expiresAt = issuedAt + 300 seconds

header = {
  alg: configured_algorithm,
  typ: "JWT",
  kid: certificate_id
}

payload = {
  iss: consumer_key,
  scope: configured_scope,
  aud: audience,
  iat: issuedAt,
  exp: expiresAt,
  jti: uuid_v4()
}

assertion = sign_jwt(header, payload, private_key)
return assertion
```

Decision rules:

- `exp` must be short-lived and greater than `iat`.
- `aud` must exactly match the account-specific token endpoint.
- `kid` must map to the certificate configured in NetSuite.

## 12.2 Algorithm B: Issue Access Token

Inputs:

- JWT client assertion
- account-specific token endpoint

Outputs:

- `access_token`
- `expires_in`
- normalized expiry timestamp

Pseudocode:

```text
payload = {
  grant_type: "client_credentials",
  client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
  client_assertion: assertion
}

response = POST form-urlencoded token_endpoint with payload

if response status is not 200:
  raise TokenIssuanceException

accessToken = response.access_token
expiresIn = response.expires_in
expiresAt = now_utc() + expiresIn seconds

return normalized response
```

## 12.3 Algorithm C: Resolve Valid Token for Consumers

Inputs:

- stored token row
- current time
- refresh guard seconds

Outputs:

- valid bearer token

Pseudocode:

```text
stored = token_store.find("netsuite", "m2m_access_token")

if stored is null:
  return refresh_and_persist()

if stored.expires_at <= now_utc() + refresh_guard_seconds:
  return refresh_and_persist()

return stored.token
```

## 12.4 Algorithm D: Persist Token

```text
upsert into sdk_tokens by (sdk, token_key):
  sdk = "netsuite"
  token_key = "m2m_access_token"
  token = access_token
  expires_at = expires_at
  created_at = now_utc()
```

## 12.5 Algorithm E: Resolve Loader API Headers

Inputs:

- `LoaderAPI` record
- configured headers from `loader_a_p_i_s.headers`

Outputs:

- final outbound header map

Pseudocode:

```text
headers = normalize_configured_headers(loader_api.headers)

if loader_api.sdk != "netsuite":
  return headers

token = netSuiteTokenService.getValidToken()
headers["Authorization"] = "Bearer " + token

return headers
```

Decision rules:

- NetSuite-managed authentication is resolved at request time, not stored permanently in `loader_a_p_i_s.headers`.
- When `sdk='netsuite'`, system-generated `Authorization` wins over any manually configured `Authorization`.
- Other configured headers such as `Content-Type` or custom vendor headers must be preserved.

# 13. Data Processing Flow

```text
Scheduler Tick
   -> RefreshNetSuiteTokenCommand
   -> NetSuiteTokenService.refresh()
   -> Build JWT assertion
   -> POST token request to NetSuite
   -> Validate response
   -> Upsert sdk_tokens
   -> Log success/failure

NetSuite API Request
   -> NetSuiteApiClient
   -> NetSuiteTokenService.getValidToken()
   -> Load token from sdk_tokens
   -> Refresh if near expiry
   -> Add Authorization: Bearer <token>
   -> Call NetSuite API

Loader API Request (`sdk='netsuite'`)
   -> DataLoaderSource / LoaderAPI
   -> LoaderApiAuthHeaderResolver
   -> NetSuiteTokenService.getValidToken()
   -> Merge configured headers with Authorization: Bearer <token>
   -> FetchJSONAPI
   -> NetSuite REST API
```

Intermediate transformations:

- Config values become normalized service config.
- JWT claims become signed client assertion.
- NetSuite JSON response becomes a normalized token DTO.
- DTO becomes a single persisted `sdk_tokens` row.

# 14. API Design

This module primarily consumes an external API and exposes an internal service interface.

## 14.1 External API: NetSuite Token Endpoint

- Method: `POST`
- URL:

```text
https://{account_id}.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token
```

- Content type: `application/x-www-form-urlencoded`

Request schema:

```http
grant_type=client_credentials
client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
client_assertion=<signed_jwt>
```

Expected response schema:

```json
{
  "access_token": "string",
  "token_type": "bearer",
  "expires_in": 3600
}
```

Error handling:

- `400` invalid grant or assertion
- `401` authentication failure
- `403` unauthorized integration configuration
- `5xx` transient upstream failure

## 14.2 Internal Service Contract

Proposed PHP interface:

```php
interface NetSuiteTokenProvider
{
    public function getValidToken(): string;

    public function refreshToken(): string;
}
```

Validation rules:

- Returned token must be non-empty.
- `refreshToken()` must throw a domain exception when the token cannot be issued.
- `getValidToken()` may reuse stored token only when outside the near-expiry window.

## 14.3 Loader API Runtime Contract

Affected model and flow:

- `App\Models\DataLoader\LoaderAPI`
- `App\Http\Requests\DataLoader\DataLoaderAPIFormRequest`
- `App\Services\DataLoader\JsonStructure\GetPrimaryFieldData`

Required behavior:

- `LoaderAPI` must include nullable field `sdk`.
- `DataLoaderAPIFormRequest` must accept nullable `sdk`.
- `LoaderAPI::$fillable` must include `sdk`.
- During request execution, headers must be normalized first, then SDK-specific auth must be applied.
- If `sdk='netsuite'`, the runtime must inject a valid bearer token automatically.
- The persisted `headers` JSON must not be used to store rotating NetSuite tokens.

# 15. Configuration

## 15.1 Required Runtime Configuration

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `services.netsuite.account_id` | string | none | NetSuite account identifier used in token endpoint hostname |
| `services.netsuite.consumer_key` | string | from `CONSUMER_KEY` | OAuth 2.0 client identifier |
| `services.netsuite.certificate_id` | string | from `CERTIFICATE_ID` | NetSuite certificate key ID mapped to integration |
| `services.netsuite.private_key_path` | string | none | Filesystem path to PEM private key |
| `services.netsuite.scope` | string | `rest_webservices` | NetSuite OAuth scope |
| `services.netsuite.assertion_alg` | string | `PS256` | JWT signing algorithm |
| `services.netsuite.refresh_guard_seconds` | int | `300` | Early refresh safety window |
| `services.netsuite.timeout_seconds` | int | `30` | HTTP timeout for token endpoint |

## 15.2 `.env` Mapping

Confirmed existing keys:

- `CERTIFICATE_ID`
- `CONSUMER_KEY`

Additional keys required for implementation:

- `NETSUITE_ACCOUNT_ID`
- `NETSUITE_PRIVATE_KEY_PATH`
- `NETSUITE_SCOPE=rest_webservices`
- `NETSUITE_ASSERTION_ALG=PS256`
- `NETSUITE_REFRESH_GUARD_SECONDS=300`
- `NETSUITE_TIMEOUT_SECONDS=30`

## 15.3 Config Access Rule

- All service classes must use `config('services.netsuite.*')`.
- No service class may call `env()` directly.

# 16. Security Considerations

- Store certificate private key outside version control.
- Do not log raw JWT assertions, access tokens, or private key contents.
- Restrict filesystem permissions for the private key file.
- Use HTTPS only; do not allow configurable downgrade to HTTP.
- Ensure token table access is server-side only.
- Redact sensitive fields in exception contexts.
- Treat `sdk_tokens.token` as secret operational data.
- Do not persist rotating NetSuite bearer tokens into `loader_a_p_i_s.headers`.

# 17. Concurrency and Idempotency

## 17.1 Locking Strategy

- Primary runtime coordination must use a Laravel cache lock keyed as `netsuite:token:refresh`.
- The implementation should use `Cache::lock()` so only one process performs the outbound NetSuite token request at a time.
- The current application configuration already uses the `database` cache store, so the initial lock backend can be database-backed without changing the calling code.
- If Redis is introduced later, the lock backend may be moved to Redis by configuration while keeping the same application-level lock API.
- Scheduler command must use `withoutOverlapping()`.
- If deployed to multiple scheduler nodes, also use `onOneServer()` when infrastructure supports it.
- Token store writes must use upsert keyed by (`sdk`, `token_key`).
- A database unique constraint on (`sdk`, `token_key`) must remain in place as a data-integrity backstop, not as the primary refresh coordination mechanism.
- Long-lived database row locks such as `SELECT ... FOR UPDATE` must not be held across the outbound HTTP call to NetSuite.

## 17.2 Idempotency Behavior

- Multiple concurrent refresh attempts must converge to one logical row.
- Repeating the same refresh command should only replace the current token row.
- API consumers calling `getValidToken()` concurrently must not create duplicate rows.

## 17.3 Conflict Resolution

- Last successful upsert wins.
- Stale token writes must not overwrite a newer token if write ordering can race. Mitigation:
- compare `expires_at` and only overwrite when new expiry is greater than or equal to existing expiry.

## 17.4 Refresh Coordination Algorithm

Recommended execution flow for concurrent callers:

```text
1. Read sdk_tokens for (sdk='netsuite', token_key='m2m_access_token')
2. If token exists and expires_at > now + refresh_guard_seconds:
      return stored token
3. Acquire Cache::lock('netsuite:token:refresh', 30)
4. Re-read sdk_tokens after lock acquisition
5. If another process already refreshed the token:
      return stored token
6. Otherwise request a new token from NetSuite
7. Upsert the token row
8. Release the cache lock
9. Return the fresh token
```

Design rationale:

- Cache locks are preferred because token refresh includes an external HTTP request and must not keep a database transaction open while waiting for NetSuite.
- Database uniqueness protects against duplicate rows but does not replace refresh coordination.
- Double-read behavior before and after lock acquisition prevents unnecessary token requests when two workers arrive at nearly the same time.

## 17.5 Loader API Concurrency Behavior

- Loader API requests using `sdk='netsuite'` must call the same shared `NetSuiteTokenService.getValidToken()` path.
- They must not implement their own refresh logic.
- Concurrent loader API requests therefore inherit the same cache-lock protection and token reuse behavior defined above.

# 18. Observability

Required logs:

- token refresh started
- token refresh succeeded
- token refresh failed
- token reused from storage
- token forced refresh because near expiry
- loader API request used sdk-managed auth

Required metrics:

- `netsuite_token_refresh_success_total`
- `netsuite_token_refresh_failure_total`
- `netsuite_token_refresh_duration_ms`
- `netsuite_token_seconds_until_expiry`
- `netsuite_loader_api_auth_injection_total`

Tracing:

- Include a correlation ID for refresh attempts when possible.

Operational dashboard signals:

- last successful refresh timestamp
- current token expiry timestamp
- consecutive refresh failures

# 19. Acceptance Criteria

```yaml
- id: AC-001
  description: The application can request a NetSuite M2M access token using configured certificate-based client assertion.
  given: valid NetSuite config and private key
  when: refreshToken() is invoked
  then: a non-empty access token is returned and persisted

- id: AC-002
  description: The token is stored in sdk_tokens using a single logical row.
  given: a successful token response
  when: the token is persisted
  then: sdk='netsuite' and token_key='m2m_access_token' identify one upserted row

- id: AC-003
  description: The scheduler refreshes the token hourly.
  given: the application scheduler is running
  when: an hour boundary is reached
  then: RefreshNetSuiteTokenCommand executes once without overlapping

- id: AC-004
  description: API consumers reuse a still-valid stored token.
  given: sdk_tokens contains a token expiring outside the safety window
  when: getValidToken() is invoked
  then: the stored token is returned without calling NetSuite

- id: AC-005
  description: API consumers refresh a near-expiry token automatically.
  given: sdk_tokens contains a token expiring within the safety window
  when: getValidToken() is invoked
  then: a new token is requested and persisted before the API call continues

- id: AC-006
  description: Expired tokens are never used for outbound NetSuite requests.
  given: sdk_tokens contains an expired token
  when: getValidToken() is invoked
  then: refreshToken() must run successfully or the request fails fast

- id: AC-007
  description: Secrets are not exposed in logs.
  given: a successful or failed token request
  when: logs are written
  then: raw bearer tokens, assertions, and private key contents are absent

- id: AC-008
  description: LoaderAPI supports sdk-aware authentication.
  given: a loader API record with sdk='netsuite'
  when: the data loader executes the API request
  then: the outbound request contains Authorization: Bearer <valid netsuite token>

- id: AC-009
  description: Generic loader APIs keep manual header behavior.
  given: a loader API record with sdk=null
  when: the data loader executes the API request
  then: stored headers are sent unchanged and no NetSuite token lookup occurs

- id: AC-010
  description: Manual Authorization headers do not override managed NetSuite auth.
  given: a loader API record with sdk='netsuite' and a stored Authorization header
  when: the request is built
  then: the system-generated NetSuite bearer token is used as the final Authorization header
```

# 20. Worked Example

## 20.1 Input Configuration

```text
NETSUITE_ACCOUNT_ID=123456_SB1
CONSUMER_KEY=abc123consumerkey
CERTIFICATE_ID=cert-prod-01
NETSUITE_PRIVATE_KEY_PATH=/secure/netsuite/private.pem
NETSUITE_SCOPE=rest_webservices
```

## 20.2 Token Refresh Execution

1. Scheduler runs `RefreshNetSuiteTokenCommand` at 10:00 UTC.
2. Service loads config and private key.
3. JWT assertion is generated with:
   - `iss=abc123consumerkey`
   - `kid=cert-prod-01`
   - `aud=https://123456_SB1.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token`
4. Application posts form data to NetSuite token endpoint.
5. NetSuite returns:

```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

6. Application writes:

```text
sdk        = netsuite
token_key  = m2m_access_token
token      = eyJhbGciOi...
expires_at = 2026-03-19 11:00:00 UTC
created_at = 2026-03-19 10:00:01 UTC
```

7. At 10:32 UTC a NetSuite API service requests a token and reuses the stored token.
8. At 10:57 UTC a NetSuite API service requests a token; because expiry is within the 5-minute guard, the token is rotated before the business API call proceeds.

Loader API example:

1. A `loader_a_p_i_s` row exists with:
   - `url=https://123456_SB1.suitetalk.api.netsuite.com/services/rest/record/v1/customer`
   - `method=GET`
   - `sdk=netsuite`
   - `headers=[{"key":"Content-Type","value":"application/json"}]`
2. Data loader executes the API.
3. Runtime resolves headers.
4. `NetSuiteTokenService.getValidToken()` returns a valid token.
5. Final outbound headers become:

```text
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...
```

# 21. Performance Requirements

- Token lookup from MySQL: less than 20 ms p95 under normal load.
- Token issuance call: less than 3 seconds p95 excluding upstream NetSuite outages.
- Scheduler refresh job runtime: less than 10 seconds under healthy conditions.
- API consumers must not perform more than one token endpoint request per hour during steady-state operation.
- Loader API execution with `sdk='netsuite'` must not add more than one token table lookup and one lock attempt in the common valid-token path.

# 22. Failure Handling

Failure scenarios and actions:

- Missing config:
  - fail fast with descriptive exception
  - do not attempt outbound request
- Missing private key file:
  - fail fast
  - log sanitized error
- NetSuite 4xx response:
  - mark refresh as failed
  - surface actionable configuration/authentication error
- NetSuite 5xx or network timeout:
  - retry according to bounded retry policy
  - if existing token is still valid, continue using it
  - if no valid token exists, fail dependent API request
- Loader API with `sdk='netsuite'` and no valid token available:
  - fail the request fast after token refresh failure
  - do not send an unauthenticated request to NetSuite
- DB write failure:
  - do not report refresh as successful
  - fail the refresh workflow

Retry policy:

- Token endpoint retries: 3 attempts max
- Backoff: exponential, e.g. 1s, 2s, 4s
- Retry only on network exceptions and `5xx`

# 23. Deployment Model

- Implementation is deployed as part of the Laravel monolith.
- Scheduler registration remains in `routes/console.php` to match the current repository pattern.
- Database changes are additive and safe for rolling deployment.
- No feature flag is required; configuration presence gates behavior.

Deployment steps:

1. Add config entries.
2. Add/create `sdk_tokens` migration if required.
3. Deploy code.
4. Run `php artisan migrate`.
5. Ensure scheduler is active.
6. Run token refresh command once manually in non-production validation.

# 24. Implementation Phases

| Phase | Deliverable | Milestone |
| --- | --- | --- |
| Phase 1 | Config + model + migration readiness | NetSuite settings and `SdkToken` model available |
| Phase 2 | JWT builder + token HTTP client + token store | Token can be issued and persisted |
| Phase 3 | Token service + API client integration | Downstream services can reuse valid token |
| Phase 4 | LoaderAPI sdk field + auth header resolver | Data loader can auto-attach NetSuite bearer token |
| Phase 5 | Scheduler command + registration | Hourly automated rotation active |
| Phase 6 | Tests + logging + operational validation | Production-ready verification complete |

# 25. Developer Checklist

- [ ] Add `services.netsuite` config mapping.
- [ ] Add or confirm `sdk_tokens` schema and unique index.
- [ ] Add nullable `sdk` column to `loader_a_p_i_s`.
- [ ] Create `App\Models\SdkToken`.
- [ ] Add `sdk` to `App\Models\DataLoader\LoaderAPI::$fillable`.
- [ ] Add `sdk` to `DataLoaderAPIFormRequest`.
- [ ] Implement JWT assertion generation using configured private key.
- [ ] Implement token endpoint HTTP client using form-urlencoded payload.
- [ ] Implement token upsert store keyed by (`sdk`, `token_key`).
- [ ] Implement `getValidToken()` near-expiry logic.
- [ ] Implement loader API auth header resolution that injects NetSuite bearer token when `sdk='netsuite'`.
- [ ] Implement `refreshToken()` error handling and retries.
- [ ] Add `RefreshNetSuiteTokenCommand`.
- [ ] Register hourly scheduler entry in `routes/console.php`.
- [ ] Ensure scheduler uses overlap protection.
- [ ] Add unit tests for assertion builder and token expiry logic.
- [ ] Add feature/integration tests for token persistence workflow.
- [ ] Validate logs do not leak secrets.
- [ ] Document required `.env` keys in `.env.example` if approved.

# 26. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Incorrect JWT signing algorithm for the uploaded certificate | Token issuance fails with 4xx responses | Make algorithm configurable and validate against NetSuite certificate setup |
| Scheduler delay causes token expiry before hourly API call | Business API request fails | Add `getValidToken()` near-expiry auto-refresh guard |
| Duplicate token rows | Ambiguous token lookup | Enforce unique index on (`sdk`, `token_key`) |
| Private key leakage in logs or repository | Severe credential compromise | Store outside VCS, restrict permissions, redact logs |
| NetSuite outage during refresh window | Hourly sync failure | Reuse still-valid token, add bounded retry, surface alerting |
| Multi-node scheduler races | Unnecessary token churn | Use `withoutOverlapping()` and `onOneServer()` where supported |
| Existing `sdk_tokens` schema differs from assumed structure | Migration/runtime failures | Inspect current schema before implementation and add compatibility migration |
| Loader API stores stale bearer token in `headers` JSON | Requests fail after token expiry | Treat Authorization as runtime-generated when `sdk='netsuite'` |
| Loader APIs bypass shared token service | Duplicate refresh logic and race conditions | Route all NetSuite loader API auth through one header resolver and token provider |
