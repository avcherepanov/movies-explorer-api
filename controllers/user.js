const bcrypt = require('bcrypt');
const jwtSign = require('../helpers/jwt-sign');
const User = require('../models/user');

const BadRequest = require('../utils/errors/BadRequest');
const BusyOwner = require('../utils/errors/busyOwner');
const NotFound = require('../utils/errors/NotFound');

const {
  errorIncorrectDataText, errorEmailText, errorUserText, errorDataText,
} = require('../configs/constants');

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    })
      .then((user) => {
        res.send(user);
      }))
    .catch((err) => {
      if (err.name === 'BadRequest') {
        next(new BadRequest(errorIncorrectDataText));
        return;
      }
      if (err.code === 11000) {
        next(new BusyOwner(errorEmailText));
        return;
      }

      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwtSign(user._id);
      res.send({ token });
    }
    .catch(next);
};

module.exports.getUserProfile = (req, res, next) => {
  User.findById(req.user._id)
  .then((user) => {
    if (user === null) {
      throw new NotFound(errorUserText);
    }
    res.send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequest(errorDataText));
      return;
    }
    next(err);
  });
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFound(errorUserText);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'BadRequest' || err.name === 'CastError') {
        next(new BadRequest(errorDataText));
        return;
      }
      if (err.code === 11000) {
        next(new BusyOwner(errorEmailText));
        return;
      }
      next(err);
    });
};
