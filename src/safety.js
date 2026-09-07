// Very small safety filter for V1. Extend as needed.
const dangerousPatterns = [
  /\bkill\b/i,
  /\bweapon\b/i,
  /\bhack(?:ing|er)?\b/i,
  /\bpassword\b/i,
  /\bcredit card\b/i,
  /\bssn\b/i
];

function isDangerous(text) {
  if (!text) return false;
  for (const re of dangerousPatterns) {
    if (re.test(text)) return true;
  }
  return false;
}

module.exports = { isDangerous };
