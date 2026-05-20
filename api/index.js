const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const expressApp = require('../backend/src/app');
const { connectDatabase } = require('../backend/src/config/db');

let dbReady = false;

expressApp.use(async (req, res, next) => {
  if (dbReady) {
    return next();
  }

  try {
    await connectDatabase();
    dbReady = true;
    return next();
  } catch (error) {
    console.error('[api] Falha ao conectar no MongoDB', error);
    return next(error);
  }
});

module.exports = async (req, res) => {
  expressApp(req, res);
};
