const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('../backend/src/app');

module.exports = (req, res) => app(req, res);
