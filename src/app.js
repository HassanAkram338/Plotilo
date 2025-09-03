const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const config = require('./config');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.corsOrigin }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
