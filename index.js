const path = require('path');
const http = require('http');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = require('./backend/src/app');

module.exports = http.createServer(app);
