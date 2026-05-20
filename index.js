const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const serverless = require('serverless-http');
const createExpressApp = require('./backend/src/createExpressApp');

module.exports = serverless(createExpressApp);
