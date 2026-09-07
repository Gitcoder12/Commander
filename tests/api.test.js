const request = require('supertest');
const app = require('../src/server');

test('GET /api/health returns ok', async () => {
  const res = await request(app).get('/api/health');
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('ok');
});

test('POST /api/suggest returns suggestions in mock mode', async () => {
  const res = await request(app).post('/api/suggest').send({ promptPartial: 'I want to know about' });
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.suggestions)).toBe(true);
  expect(res.body.suggestions.length).toBeGreaterThan(0);
});
