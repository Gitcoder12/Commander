# Commander — Feature Upgrade Plan

## Objective

A Node.js API that takes an incomplete prompt and asks several specialist agents to produce clearer, more useful alternatives.

## P0 — API security and spend controls

- [ ] Restrict CORS to configured frontend origins and default to localhost development.
- [ ] Add request rate limits, max concurrent model-call budget, payload limits and model-call timeout.

## P1 — robustness and observability

- [ ] Add structured request validation, per-request trace ID, safe error responses and bounded cache policy.
- [ ] Expose cost/token telemetry without logging prompts or secrets unnecessarily.

## P2 — measurable output quality

- [ ] Evaluate prompt-improvement quality with fixed tasks and a blinded human rubric.
- [ ] Compare specialist-agent combination against a single-model baseline and report cost/latency trade-offs.

## Contributor work packages

1. CORS/auth/rate/concurrency controls with negative tests.
2. Request schema and bounded model call pipeline.
3. Safe telemetry and cache behavior.
4. Human evaluation and single-agent baseline comparison.

## Definition of done

- [ ] Unsafe origins and excessive request rates are rejected.
- [ ] Model calls have a bounded timeout and concurrency/cost budget.
- [ ] Mock mode remains functional without credentials.
- [ ] Quality claims are supported by a documented rubric and task set.
