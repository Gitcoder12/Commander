# Commander ⚡

Commander is an AI-powered prompt copilot that turns partial prompts into useful, ready-to-use suggestions.

It is designed for an **inline/autocomplete UX**, not a normal chatbot. Instead of asking one model to finish text, Commander orchestrates several focused agents that can **finish, expand, clarify, critique, format, split, and strengthen** a prompt.

## Core idea

```text
User types a partial prompt
        ↓
   Commander API
        ↓
 ┌──────┼──────────────────────────┐
 ↓      ↓       ↓       ↓          ↓
Finish Expand Clarify Critic   Formatter...
 └──────┴──────────────────────────┘
        ↓
 Deduplicate + score + diversify
        ↓
  Top suggestions → editor
```

## Agent roles

| Agent | Purpose |
|---|---|
| `finisher` | Completes the prompt without changing its intent |
| `expander` | Adds useful context, constraints, and expected output |
| `clarifier` | Finds the most valuable missing constraint |
| `critic` | Finds ambiguity or a weak assumption |
| `formatter` | Suggests a useful output structure |
| `stepper` | Converts a task into 3–5 actionable steps |
| `persona` | Adds an expert role when it materially helps |

## API

### `POST /api/suggest`

Request:

```json
{
  "promptPartial": "build me a website for",
  "cursorIndex": 27,
  "context": "The user is building a portfolio site",
  "max_suggestions": 5
}
```

Response:

```json
{
  "suggestions": [
    {
      "id": "finisher-...",
      "text": "Build me a responsive portfolio website...",
      "score": 0.93,
      "type": "complete",
      "agent": "finisher"
    }
  ],
  "model": "gpt-5.6-luna",
  "cached": false
}
```

## UX target

Commander should eventually support:

- **Ghost completion:** highest-confidence completion appears inline; `Tab` accepts it.
- **Suggestion palette:** `↑ ↓ Enter` navigates 3–6 alternatives.
- **Combine:** accept useful pieces from different agents.
- **Preview:** inspect the complete prompt before inserting it.
- **Keyboard-first:** the user should rarely need to leave the editor.

## MVP architecture

The current MVP is intentionally small:

- Node.js HTTP server
- Parallel specialist agents
- OpenAI Responses API adapter
- Strict JSON output from agents
- Deduplication
- Novelty scoring
- Type diversity in the final ranking
- Short-lived in-memory cache
- Mock mode when `OPENAI_API_KEY` is not configured

No frontend framework or dependency is required yet. This keeps the core orchestration easy to test and replace.

## Run locally

```bash
cp .env.example .env
npm start
```

Without an API key, Commander runs in mock mode.

Test the endpoint:

```bash
curl -X POST http://localhost:3000/api/suggest \
  -H "content-type: application/json" \
  -d '{"promptPartial":"build me a portfolio website","max_suggestions":5}'
```

## Roadmap

### Phase 1 — Core engine

- [x] Agent definitions
- [x] Parallel orchestration
- [x] JSON parsing
- [x] Ranking and deduplication
- [x] Mock mode
- [x] API endpoint

### Phase 2 — Editor UX

- [ ] Inline ghost completion
- [ ] Suggestion palette
- [ ] Keyboard controls
- [ ] Accept/replace/append actions
- [ ] Combine suggestions

### Phase 3 — Production intelligence

- [ ] Streaming suggestions
- [ ] Better semantic similarity
- [ ] User-specific preferences
- [ ] Model routing by task complexity
- [ ] Cost and latency telemetry
- [ ] Persistent cache
- [ ] Abuse/rate limiting

### Phase 4 — Commander becomes a prompt operating layer

- [ ] Learn from accepted/rejected suggestions
- [ ] Context-aware suggestions from the editor
- [ ] Repository/project context
- [ ] Automatic prompt quality scoring
- [ ] Multi-model routing
- [ ] Local-model support

## Design principle

**Commander should make prompting faster, not make prompting more complicated.**

The system should do the hard work behind the editor while the user stays in control.


---

## AI-maintained project notes (secondary — 2026-11-13)

This section supplements the maintainer-authored README above. The original text has been restored verbatim from Git-history baseline `9650672c90a079f527bc2da7ab846631a1af94a8`; this addendum does not replace or certify the original claims.

- The current source tree, runtime data and tests are the implementation source of truth. Roadmap items, draft PRs and AI-generated descriptions are not shipped features by themselves.
- Preserve real and maintainer-provided data. Never silently substitute generated or placeholder data. Clearly label and isolate synthetic fixtures.
- Mark unverified sources, identifiers, metrics, benchmark results and external claims as unknown/unverified rather than guessing.
- Verify setup, execution, tests and public claims against the exact current commit before using this repository in a job, research or academic application.
- See [MODEL_AUDIT_ROUTER.md](MODEL_AUDIT_ROUTER.md) for independent model review instructions and the merge gate.
