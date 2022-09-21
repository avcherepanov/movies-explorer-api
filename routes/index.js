const NotFound = require('../utils/errors/NotFound');
const userRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login, signOut } = require('../controllers/user');
const auth = require('../middlewares/auth');
const { createUserValidation, loginValidation } = require('../utils/joiValidation/joiValidation');
const { errorNotFoundText } = require('../configs/constants');

module.exports = (app) => {
  app.post('/signup', createUserValidation, createUser);

  app.post('/signin', loginValidation, login);

  app.use('/users', auth, userRouter);
  app.use('/movies', auth, moviesRouter);

  app.get('/signout', signOut);

  app.use(auth, (req, res, next) => next(new NotFound(errorNotFoundText)));
};
