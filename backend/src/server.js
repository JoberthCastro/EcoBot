const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const app = require('./app');
const { connectDatabase } = require('./config/db');
const { port } = require('./config/env');

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`EcoBot API running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start EcoBot API', error);
  process.exit(1);
});
