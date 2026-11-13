# Commander

**A lightweight Node.js service that turns partial prompts into ranked, diverse suggestions.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Commander is a prompt-improvement API, not a chat interface. It runs a set of focused agents in parallel to complete, expand, clarify, critique, format, or break a partial prompt into steps.

## Current Features

- Seven specialist prompt agents.
- Parallel calls through the OpenAI Responses API.
- JSON-structured agent outputs.
- Deduplication, novelty scoring, and type-aware ranking.
- Short-lived in-memory response cache.
- Mock mode when `OPENAI_API_KEY` is not configured.

## Quick Start

Node.js 20 or later is required.

```bash
git clone https://github.com/Gitcoder12/Commander.git
cd Commander
cp .env.example .env
```

Edit `.env` and add an API key to enable live model requests. Without a key, Commander returns deterministic mock suggestions.

```bash
npm start
```

The API listens on `http://localhost:3000`.

## API

### `POST /api/suggest`

Request:

```json
{
  "promptPartial": "build me a website for",
  "context": "The user is building a portfolio site",
  "max_suggestions": 5
}
```

Response shape:

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
  "model": "gpt-6-luna",
  "cached": false
}
```

Try it locally:

```bash
curl -X POST http://localhost:3000/api/suggest \
  -H "content-type: application/json" \
  -d '{"promptPartial":"build me a portfolio website","max_suggestions":5}'
```

## Configuration

| Variable | Purpose |
|---|---|
| `PORT` | HTTP server port (default: `3000`) |
| `OPENAI_API_KEY` | Enables live model calls; omit to use mock mode |
| `COMMANDER_MODEL` | OpenAI model ID (default: `gpt-6-luna`) |
| `MAX_SUGGESTIONS` | Default maximum number of returned suggestions |
| `CACHE_TTL_MS` | In-memory cache lifetime in milliseconds |

Use a model ID available to your OpenAI API project and override `COMMANDER_MODEL` as needed.

## Run Tests

```bash
npm test
```

The tests cover suggestion deduplication, score ordering, and type diversity.

## Project Structure

```text
Commander/
├── src/
│   ├── server.js  # HTTP endpoint and model orchestration
│   ├── agents.js  # Specialist agent instructions
│   └── ranker.js  # Deduplication, novelty, and ranking
├── tests/
│   └── ranker.test.js
├── .env.example
└── package.json
```

## Scope and Limitations

Commander currently exposes the suggestion API; the inline editor/autocomplete interface is a roadmap item, not part of the committed application. Live suggestions require an OpenAI API key and a model available to the account. Mock mode does not call any external provider. The response cache is in-memory and resets when the process restarts.

## License

MIT. See [LICENSE](LICENSE).

---

## Project handbook

- [Activity log](ACTIVITY_LOG.md) · [Feature upgrade plan](FEATURE_UPGRADE_PLAN.md)
- [Company and team fit](COMPANY_FIT.md) · [README explanation draft](README_ADDENDUM_DRAFT.md)
- [README quality checklist](README_QUALITY_CHECKLIST.md)
- [Contributing](CONTRIBUTING.md) · [Agent instructions](AGENTS.md) · [Agent skills](SKILLS.md)

## Understanding the project

### In plain language

A Node.js API that takes an incomplete prompt and asks several specialist agents to produce clearer, more useful alternatives.

### Technical and research view

A user submits a partial prompt. Several specialist agents propose different improvements. The service removes near-duplicates, ranks suggestions and returns structured alternatives. In mock mode, it returns deterministic examples without making paid model calls.

For future work, see [FEATURE_UPGRADE_PLAN.md](FEATURE_UPGRADE_PLAN.md), [ACTIVITY_LOG.md](ACTIVITY_LOG.md), [COMPANY_FIT.md](COMPANY_FIT.md) and [CONTRIBUTING.md](CONTRIBUTING.md).
