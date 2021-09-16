const express = require('express');

//add auth controller
const authController = require('../controllers/auth');

const router = express.Router();


router.post('/register', authController.register);
router.post('/login',authController.login);

module.exports = router;