import express from 'express';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Don't announce to the world that we use Express (a tiny security habit)
app.disable('x-powered-by');

// A "health check": a URL that answers "yes, the server is alive"
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});