const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { corsOrigin } = require('./config/env');

const app = express();

app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

module.exports = app;
