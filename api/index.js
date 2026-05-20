const http = require('http');
const app = require('../backend/src/app');

module.exports = http.createServer(app);
