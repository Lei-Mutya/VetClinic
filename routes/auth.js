const express = require('express');

//add auth controller
const authController = require('../controllers/auth');

const router = express.Router();


router.post('/register', authController.register);
router.post('/login',authController.login);
router.get('/petreg/:userID', authController.petreg);
router.post('/addPetreg', authController.addPetreg);
module.exports = router;