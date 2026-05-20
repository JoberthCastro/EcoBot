const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const routes = require('./routes');
const userRoutes = require('./routes/userRoutes');
const { corsOrigin } = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.set('etag', false);
app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});
app.use('/api/users', userRoutes);
app.use('/api', routes);

const distPath = path.resolve(__dirname, '..', '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use(errorHandler);

module.exports = app;
