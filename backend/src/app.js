const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust the first proxy (required on Railway/Heroku-style platforms so that
// rate-limit, secure cookies, and req.ip work correctly behind the edge proxy).
app.set('trust proxy', 1);

const corsOrigin = process.env.CORS_ORIGIN || process.env.CLIENT_URL || '*';
app.use(helmet());
app.use(
  cors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', routes);
app.use(errorHandler);

module.exports = app;