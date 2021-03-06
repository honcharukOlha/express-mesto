const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login } = require('./controllers/login');
const { createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const handlingErrors = require('./app-handling-errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

// создаем приложение
const app = express();
app.use(express.json());

app.use(cors());
app.options('https://super.mesto.nomoredomains.club', cors());

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    'https://super.mesto.nomoredomains.club',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  next();
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mongodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: 'Вы превысили лимит в 100 запросов за 10 минут!',
  }),
);

app.use(helmet());

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// регистрация и логин
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(
        /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w\W.-]*)#?$/,
      ),
    }),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

// авторизация
app.use(auth);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use('/*', (req, res, next) => {
  next(
    new NotFoundError(
      'Ресурс не найден',
    ),
  );
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use(handlingErrors);

app.listen(PORT);
