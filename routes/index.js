const NotFound = require('../utils/errors/NotFound');
const userRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login } = require('../controllers/user');
const auth = require('../middlewares/auth');
const { createUserValidation, loginValidation } = require('../utils/joiValidation/joiValidation');

module.exports = (app) => {
  app.post('/signup', createUserValidation, createUser);

  app.post('/signin', loginValidation, login);

  app.use('/users', auth, userRouter);
  app.use('/movies', auth, moviesRouter);

  app.use(auth, (req, res, next) => next(new NotFound('Страница не найдена')));
};
