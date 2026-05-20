const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const routes = require('./routes');
const userRoutes = require('./routes/userRoutes');
const { corsOrigin } = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');
const securityHeaders = require('./middlewares/securityHeaders');
const { connectDatabase } = require('./config/db');

const server = express();

server.disable('x-powered-by');
server.set('etag', false);

let dbReady = false;

server.use(async (req, res, next) => {
  if (dbReady) {
    return next();
  }

  try {
    await connectDatabase();
    dbReady = true;
    return next();
  } catch (error) {
    console.error('[db] Falha ao conectar no MongoDB', error);
    return next(error);
  }
});

server.use(securityHeaders);
server.use(cors({ origin: corsOrigin }));
server.use(express.json());
server.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});
server.use('/api/users', userRoutes);
server.use('/api', routes);

const publicPath = path.resolve(__dirname, '..', '..', 'public');
const distPath = path.resolve(__dirname, '..', '..', 'dist');
const cwdPublicPath = path.resolve(process.cwd(), 'public');
const staticPath = [publicPath, cwdPublicPath, distPath].find((candidate) => fs.existsSync(candidate));

if (staticPath) {
  server.use(
    express.static(staticPath, {
      index: 'index.html',
      setHeaders(res, filePath) {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          return;
        }

        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    })
  );
  server.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(staticPath, 'logo.png'));
  });
  server.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
} else {
  console.warn('[static] Pasta public/ não encontrada no deploy');
}

server.use(errorHandler);

module.exports = server;
