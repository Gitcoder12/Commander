import http from "node:http";
import { AGENTS, buildAgentPrompt } from "./agents.js";
import { addNovelty, rankSuggestions } from "./ranker.js";

const PORT = Number(process.env.PORT || 3000);
const MODEL = process.env.COMMANDER_MODEL || "gpt-5.6-luna";
const MAX_SUGGESTIONS = Math.min(Number(process.env.MAX_SUGGESTIONS || 5), AGENTS.length);
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 60000);
const cache = new Map();

function json(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type"
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 100_000) req.destroy();
    });
    req.on("end", () => {
      try { resolve(JSON.parse(raw || "{}")); }
      catch { reject(new Error("Invalid JSON")); }
    });
    req.on("error", reject);
  });
}

function extractJson(text) {
  const cleaned = String(text || "").replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("Model did not return JSON");
  return JSON.parse(cleaned.slice(start, end + 1));
}

async function callModel(agent, promptPartial, context) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      text: `[mock:${agent.id}] Improve this prompt: ${promptPartial}`,
      score: 0.5
    };
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      input: buildAgentPrompt(agent, promptPartial, context),
      text: { format: { type: "json_object" } }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Model request failed (${response.status}): ${message.slice(0, 300)}`);
  }

  const data = await response.json();
  const outputText = data.output_text || data.output?.flatMap(x => x.content || []).find(x => x.text)?.text;
  const parsed = extractJson(outputText);
  return { text: parsed.text, score: Number(parsed.score) };
}

async function suggest({ promptPartial, context = "", max_suggestions = MAX_SUGGESTIONS }) {
  const key = JSON.stringify({ promptPartial, context, max_suggestions });
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return cached.value;

  const agents = AGENTS.slice(0, Math.max(1, Math.min(Number(max_suggestions), AGENTS.length)));
  const results = await Promise.allSettled(
    agents.map(async agent => {
      const result = await callModel(agent, promptPartial, context);
      return {
        id: `${agent.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text: result.text,
        score: result.score,
        type: agent.type,
        agent: agent.id
      };
    })
  );

  const suggestions = results
    .filter(r => r.status === "fulfilled")
    .map(r => r.value);

  const ranked = rankSuggestions(addNovelty(suggestions, promptPartial), Number(max_suggestions));
  const value = { suggestions: ranked, model: MODEL, cached: false };
  cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
  return value;
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return json(res, 204, {});
  if (req.method !== "POST" || req.url !== "/api/suggest") {
    return json(res, 404, { error: "Not found" });
  }

  try {
    const body = await readBody(req);
    const promptPartial = String(body.promptPartial || "").trim();
    if (!promptPartial) return json(res, 400, { error: "promptPartial is required" });
    if (promptPartial.length > 20_000) return json(res, 400, { error: "promptPartial is too long" });

    const result = await suggest(body);
    return json(res, 200, result);
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: error.message || "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`Commander listening on http://localhost:${PORT}`);
});
