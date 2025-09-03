require('dotenv').config();

const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

if (!config.databaseUrl) {
  console.warn('DATABASE_URL not set in .env — Prisma will error if you try to connect.');
}

module.exports = config;
