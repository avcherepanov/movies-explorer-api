require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimit');
const cors = require('./middlewares/cors');
const router = require('./routes/index');
const { handleError } = require('./utils/handleError/handleError');
const { DATABASE } = require('./configs');

const { PORT = 3000, MONGO_URL = DATABASE } = process.env;

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);

app.use(requestLogger);

app.use(limiter);

router(app);

app.use(errorLogger);

app.use(errors());

app.use(handleError);

mongoose.connect(MONGO_URL);

app.listen(PORT, () => {
});
