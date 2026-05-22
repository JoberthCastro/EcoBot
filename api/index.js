const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

let httpServer;

module.exports = async (req, res) => {
  if (!httpServer) {
    httpServer = require('../backend/src/createExpressApp');
  }

  return httpServer(req, res);
};
