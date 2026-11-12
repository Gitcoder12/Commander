import test from "node:test";
import assert from "node:assert/strict";
import { rankSuggestions } from "../src/ranker.js";

test("rankSuggestions removes duplicate text and sorts by score", () => {
  const result = rankSuggestions([
    { id: "a", text: "Make a clear plan", score: 0.7, type: "complete" },
    { id: "b", text: "Make a clear plan", score: 0.9, type: "expand" },
    { id: "c", text: "Identify missing constraints", score: 0.8, type: "clarify" },
  ], 5);

  assert.equal(result.length, 2);
  assert.equal(result[0].text, "Make a clear plan");
  assert.equal(result[0].score, 0.9);
});

test("rankSuggestions preserves type diversity when possible", () => {
  const result = rankSuggestions([
    { id: "a", text: "Complete this detailed prompt", score: 0.9, type: "complete" },
    { id: "b", text: "Expand this prompt with useful context", score: 0.8, type: "expand" },
    { id: "c", text: "Clarify the missing requirement", score: 0.7, type: "clarify" },
  ], 3);

  assert.deepEqual(result.map((item) => item.type), ["complete", "expand", "clarify"]);
});
