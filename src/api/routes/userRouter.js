const express = require("express");
const userController = require("../controllers/userController");
const {body} = require('express-validator');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router()

router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/register', 
  body('email').isEmail(),
  body('password').isLength({min: 3, max: 32}),
  userController.register
)
router.post('/refresh', userController.refresh)
router.get('/', authMiddleware, userController.getUsers)

module.exports = router;