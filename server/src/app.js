const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const masterRoutes = require('./routes/masterRoutes');
const abilityRoutes = require('./routes/abilityRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/masters', masterRoutes);
app.use('/api/abilities', abilityRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

