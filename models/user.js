const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const AuthorizationError = require('../utils/errors/AuthorizationError');
const { errorUnauthorizedText } = require('../configs/constants');

const userSchema = mongoose.Schema(
  {
    email: {
      required: true,
      type: String,
      unique: true,
      index: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Неверный email',
      },
    },
    password: {
      required: true,
      type: String,
      select: false,
    },
    name: {
      required: true,
      type: String,
      minlength: 2,
      maxlength: 30,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationError(errorUnauthorizedText));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizationError(errorUnauthorizedText));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
