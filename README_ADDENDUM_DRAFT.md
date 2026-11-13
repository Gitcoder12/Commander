# Commander — README Explanation Draft

## In plain language

A Node.js API that takes an incomplete prompt and asks several specialist agents to produce clearer, more useful alternatives.

## How it works

A user submits a partial prompt. Several specialist agents propose different improvements. The service removes near-duplicates, ranks suggestions and returns structured alternatives. In mock mode, it returns deterministic examples without making paid model calls.

## Technical explanation

Node.js service using the OpenAI Responses API with seven specialist prompt agents, structured outputs, deduplication, novelty scoring, ranking, an in-memory cache and a mock mode without an API key. The audit identified unrestricted CORS, no authentication/rate limit, parallel paid model calls and unbounded request concurrency as risks if the API is exposed beyond localhost.

Document the request schema, agent responsibilities, parallel execution, model configuration, ranking method, cache keys, error handling and rate controls.

## Security and cost

State whether the API is local-only or public. Document authentication, CORS allowlist, rate limits, request size, max concurrency, timeouts and estimated token/cost behavior. Never expose API keys to browsers or logs.

## Contributing

See FEATURE_UPGRADE_PLAN.md and CONTRIBUTING.md.
