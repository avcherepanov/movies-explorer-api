require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const { MONGO_URL, NODE_ENV, PORT } = process.env;
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimit');
const cors = require('./middlewares/cors');
const router = require('./routes/index');
const { handleError } = require('./utils/handleError/handleError');

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

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/bitfilmsdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

  .then(() => {
    app.listen(NODE_ENV === 'production' ? PORT : 3000, () => {
      console.log(`App started on ${PORT} port`);
    });
  })
  .catch((e) => console.log(e));
