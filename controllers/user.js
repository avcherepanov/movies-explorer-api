const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET_DEV } = require('../configs/index');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequest = require('../utils/errors/BadRequest');
const BusyOwner = require('../utils/errors/busyOwner');
const NotFound = require('../utils/errors/NotFound');

const {
  errorIncorrectDataText, errorEmailText, errorUserText
} = require('../configs/constants');

const saltRound = 10;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, saltRound)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      const userData = {
        email: user.email,
        name: user.name,
        _id: user._id,
      };
      res.send(userData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(errorIncorrectDataText));
      } else if (err.code === 11000) {
        next(new BusyOwner(errorEmailText));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports.signOut = (req, res) => {
  res
    .status(200)
    .clearCookie('token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    .send({ message: 'осуществлен выход из системы' });
};

module.exports.getUserProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!req.user._id) {
        next(new NotFound(errorUserText));
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFound(errorUserText));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(errorIncorrectDataText));
      } else if (err.code === 11000) {
        next(new BusyOwner(errorEmailText));
      } else {
        next(err);
      }
    });
};
