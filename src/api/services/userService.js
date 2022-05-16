const tokenService = require('./TokenService');
const db = require('../../config/db');
const ApiError = require('../helpers/apiError');

class UserService {

  async register({email, password, firstName, lastName, phone}) {
    const candidate = await db.query("SELECT * FROM isEmailAlreadyRegistred($1);", [email]);
    if(candidate.rows[0].isemailalreadyregistred) {
      throw ApiError.BadRequest("Пользователь стаким email существует!")
    }
    const userRequest = await db.query("SELECT * FROM createuser($1, $2, $3, $4, $5);", [email, password, firstName, lastName, phone])
    const user = userRequest.rows[0];
    const userDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      role: user.role
    }
    const tokens = tokenService.generateToken({...userDto});

    await tokenService.saveToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }
}

module.exports = new UserService();