# Agent Instructions — Commander

Read README.md, CONTRIBUTING.md and FEATURE_UPGRADE_PLAN.md first.

- Prioritise API security and spend controls before adding agents.
- Never expose or commit provider keys.
- Bound request size, concurrency, timeouts and cache growth.
- Validate request payloads and reject untrusted origins.
- Use mock providers in tests; do not trigger paid requests without explicit approval.
- Do not log raw prompts or secrets by default.
- Work on a branch and open a PR; do not merge or deploy autonomously.
