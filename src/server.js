const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { orchestrate } = require('./orchestrator');
const { combineSelected } = require('./combine');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '64kb' }));

const limiter = rateLimit({ windowMs: 60_000, max: 120 });
app.use(limiter);

// serve static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: 'v1' });
});

app.post('/api/suggest', async (req, res) => {
  try {
    const body = req.body || {};
    const { promptPartial, cursorIndex = null, context = {}, max_suggestions = 5, all = false } = body;

    if (!promptPartial || typeof promptPartial !== 'string') return res.status(400).json({ error: 'promptPartial (string) required' });
    if (max_suggestions <= 0) return res.status(400).json({ error: 'max_suggestions must be positive' });

    const suggestions = await orchestrate({ promptPartial, cursorIndex, context, max_suggestions, all });
    res.json({ suggestions });
  } catch (err) {
    console.error('api/suggest error', err && err.stack || err);
    res.status(500).json({ error: 'generation_failed' });
  }
});

app.post('/api/combine', async (req, res) => {
  try {
    const body = req.body || {};
    const { selected = [], promptPartial = '', context = {} } = body;
    if (!Array.isArray(selected) || selected.length === 0) return res.status(400).json({ error: 'selected array required' });

    const combined = await combineSelected({ selected, promptPartial, context });
    res.json({ combined });
  } catch (err) {
    console.error('api/combine error', err && err.stack || err);
    res.status(500).json({ error: 'combine_failed' });
  }
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Commander v1 listening on http://localhost:${port}`));
}

module.exports = app;
