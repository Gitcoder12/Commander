export const AGENTS = [
  {
    id: "finisher",
    type: "complete",
    instruction: "Finish the user's partial prompt into one concise, ready-to-send prompt. Preserve intent and avoid inventing requirements."
  },
  {
    id: "expander",
    type: "expand",
    instruction: "Turn the partial prompt into a stronger actionable prompt with useful context, constraints, and an expected output when appropriate."
  },
  {
    id: "clarifier",
    type: "clarify",
    instruction: "Identify the single most valuable missing constraint. Return a short question or a short constraint the user could add."
  },
  {
    id: "critic",
    type: "critique",
    instruction: "Spot the biggest ambiguity, weak assumption, or failure mode in the prompt and propose a concise improvement."
  },
  {
    id: "formatter",
    type: "format",
    instruction: "Suggest a useful output format or instruction that would make the requested result easier to use."
  },
  {
    id: "stepper",
    type: "steps",
    instruction: "Convert the task into a compact sequence of 3–5 actionable steps that an AI can follow."
  },
  {
    id: "persona",
    type: "role",
    instruction: "Suggest a useful expert role or perspective only when it materially improves the prompt. Keep it concise."
  }
];

export function buildAgentPrompt(agent, promptPartial, context = "") {
  return `You are the ${agent.id} agent inside Commander, a prompt-improvement engine.\n\nTASK:\n${agent.instruction}\n\nUSER PROMPT:\n${promptPartial}\n\nCONTEXT:\n${context || "None provided."}\n\nRULES:\n- Keep the user's intent intact.\n- Do not fabricate facts, requirements, tools, or constraints.\n- Be concise and useful.\n- Return exactly one suggestion.\n- Return ONLY valid JSON in this shape: {"text":"...","score":0.0}\n- score must be between 0 and 1.\n`;
}
