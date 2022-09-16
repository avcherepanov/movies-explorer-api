const userRouter = require('express').Router();

const { getUserProfile, updateProfile } = require('../controllers/user');
const { updateProfileValidation } = require('../utils/joiValidation/joiValidation');

userRouter.get('/me', getUserProfile);

userRouter.patch('/me', updateProfileValidation, updateProfile);

module.exports = userRouter;
