const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function similarity(a, b) {
  const aa = new Set(normalize(a).split(" ").filter(Boolean));
  const bb = new Set(normalize(b).split(" ").filter(Boolean));
  if (!aa.size || !bb.size) return 0;
  let intersection = 0;
  for (const token of aa) if (bb.has(token)) intersection++;
  return intersection / new Set([...aa, ...bb]).size;
}

export function rankSuggestions(suggestions, max = 5) {
  const deduplicated = new Map();

  for (const item of suggestions) {
    const text = String(item.text || "").trim();
    const key = normalize(text);
    if (!text) continue;

    const raw = Number.isFinite(item.score) ? item.score : 0.6;
    const words = text.split(/\s+/).length;
    const lengthPenalty = words < 4 ? 0.08 : words > 100 ? 0.08 : 0;
    const finalScore = clamp(raw + (item.novelty ?? 0) - lengthPenalty);
    const candidate = { ...item, text, score: Number(finalScore.toFixed(3)) };
    const existing = deduplicated.get(key);

    // Keep the strongest variant when two agents produce the same text.
    if (!existing || candidate.score > existing.score) {
      deduplicated.set(key, candidate);
    }
  }

  const unique = [...deduplicated.values()];
  unique.sort((a, b) => b.score - a.score);

  // Prefer diversity so Commander does not return near-identical agent types.
  const selected = [];
  const usedTypes = new Set();
  for (const item of unique) {
    if (selected.length >= max) break;
    if (!usedTypes.has(item.type) || selected.length >= max - 1) {
      selected.push(item);
      usedTypes.add(item.type);
    }
  }

  return selected;
}

export function addNovelty(suggestions, promptPartial) {
  return suggestions.map(item => ({
    ...item,
    novelty: Number((1 - similarity(item.text || "", promptPartial)).toFixed(3)) * 0.1
  }));
}
