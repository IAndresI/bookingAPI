const userServive = require('../services/userService');
const {validationResult} = require('express-validator');
const ApiError = require('../helpers/apiError');

class UserController {
  async login(req, res, next) {
    try {
      const {emailOrUserName, password} = req.body;
      const userData = await userServive.login(emailOrUserName, password);

      res.cookie("refreshToken", userData.refreshToken, {httpOnly: true, maxAge: 30*24*60*60*1000});
      return res.json(userData);
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
      const {refreshToken} = req.cookies;
      const token = await userServive.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token)
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await userServive.refresh(refreshToken);

      res.cookie("refreshToken", userData.refreshToken, {httpOnly: true, maxAge: 30*24*60*60*1000});

      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userServive.getAllUsers();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
