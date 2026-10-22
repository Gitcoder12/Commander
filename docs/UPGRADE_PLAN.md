# Commander upgrade plan
Audit date: 2026-10-22. Written on branch `docs/upgrade-plan`.

## Current state (measured)
- Node.js, **zero dependencies**: `src/server.js` (127 lines), `src/ranker.js` (55), `src/agents.js` (41). `npm start` runs `node src/server.js`
- README is 154 lines: longer than the code it describes
- No tests, no CI. Node 22 is available, which includes a built-in test runner (`node --test`)
- Not yet verified: whether `agents.js` calls a real model or returns canned suggestions

## Goals, in order
1. **Establish the truth.** Read the code and document what is real and what is a stub. Make the README match reality, or open issues for each gap.
   Done when every README claim is true or is marked "planned".
2. **Tests with no new dependencies.** `node --test`: unit tests for ranking, deduplication and diversity scoring; HTTP tests for each route.
3. **Harden the server.** Maximum body size, maximum prompt length, input validation with clear 4xx errors, rate limiting, timeouts on any upstream call, no stack traces in responses.
4. **CI.** GitHub Actions on Node 22 running `node --test`.
5. **Evaluation.** A fixed prompt set and honest metrics (for example: duplicate rate and top-3 acceptance). Never publish numbers that were not measured.

## Quality gate
`node --test`

## Rules for any contributor or AI model working from this plan
1. Work on a **new branch** (for example `feat/<topic>`). Never push to `main`. Open a pull request.
2. Run the quality gate before every push. Paste the real test output into the PR description.
3. Do not claim anything you did not measure. No invented benchmarks, no placeholder numbers.
4. Small, focused commits. Take git identity from `git log -1`; never invent an email address.
5. Never commit secrets, tokens, raw data or generated artifacts.
6. When a task is finished, tick its box here and note the date and PR number.

## Status
- [ ] Not started
