const app = require('./app');
const config = require('./config');
const prisma = require('./prisma/client');

async function start() {
  try {
    // Test DB connection early (Prisma will connect lazily; a small query ensures connectivity)
    await prisma.$connect();
    console.log('Prisma connected to DB');
  } catch (err) {
    console.error('Prisma connection error:', err);
  }

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}/api/v1`);
  });
}
start();
