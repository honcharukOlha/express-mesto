const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login } = require('./controllers/login');
const { createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const handlingErrors = require('./app-handling-errors');

const { PORT = 3000 } = process.env;
// создаем приложение
const app = express();
app.use(express.json());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mongodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: 'Вы превысили лимит в 100 запросов за 10 минут!',
}));

app.use(helmet());

// регистрация и логин
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
// авторизация
app.use(auth);

app.use(bodyParser.json());
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use('/*', (req, res, next) => {
  next(new NotFoundError({
    message: 'Ресурс не найден',
  }));
});

app.use((errors));

app.use(handlingErrors);

app.listen(PORT);
