const userServive = require('../services/userService');
const {validationResult} = require('express-validator');
const ApiError = require('../helpers/apiError');

class UserController {
  async login(req, res, next) {
    try {
      res.json("login")
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const validation = validationResult(req);
      if(validation.errors.length > 0) {
        throw next(ApiError.BadRequest('Ошибка при валидации', validation.errors))
      }
      const {email, password, firstName, lastName, phone = null} = req.body;
      const userData = await userServive.register({email, password, firstName, lastName, phone});
      
      res.cookie("refreshToken", userData.refreshToken, {httpOnly: true, maxAge: 30*24*60*60*1000});
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.json("logout")
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      res.json("refresh")
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      res.json("getUsers")
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
