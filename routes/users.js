const router = require('express').Router();
const { validateUserInfo } = require('../middlewares/validation');

const {
  getUserProfile,
  updateProfile,
} = require('../controllers/users');

router.get('/me', getUserProfile);

router.patch('/me', validateUserInfo, updateProfile);

module.exports = router;
