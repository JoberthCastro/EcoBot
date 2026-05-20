const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('../backend/src/app');
const { connectDatabase } = require('../backend/src/config/db');

let isReady = false;

module.exports = async (req, res) => {
  if (!isReady) {
    await connectDatabase();
    isReady = true;
  }

  return app(req, res);
};
