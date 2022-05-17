const tokenService = require('./tokenService');
const db = require('../../config/db');
const ApiError = require('../helpers/apiError');

class UserService {

  async register({email, password, firstName, lastName, phone}) {

    const candidate = await db.query("SELECT * FROM isEmailAlreadyRegistred($1);", [email]);

    if(candidate.rows[0].isemailalreadyregistred) {
      throw ApiError.BadRequest("Пользователь стаким email существует!")
    }

    const userRequest = await db.query(
      "SELECT * FROM createuser($1, $2, $3, $4, $5);",
      [email, password, firstName, lastName, phone]
    );
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

  async login (emailOrUserName, password) {
    const userExists = await db.query(
      `SELECT 1 FROM "user" WHERE email ILIKE($1) OR "userName" ILIKE($1);`,
      [emailOrUserName]
    );

    if(!userExists.rows[0]) throw ApiError.BadRequest("Пользователя с таким логином или email не существует!"); 

    const userRequest = await db.query(
      `SELECT id, email, "firstName", "lastName", "userName", role FROM "user" WHERE (email ILIKE($1) OR "userName" ILIKE($1)) AND "password" = crypt($2, "password");`,
      [emailOrUserName, password]
    )

    const user = userRequest.rows[0];

    if(!user) throw ApiError.BadRequest("Неверный пароль!");

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

  async logout(refreshToken) {
    const token = await tokenService.deleteToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if(!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = tokenService.findToken(refreshToken);

    if(!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }

    const userRequest = await db.query(`SELECT id, email, "firstName", "lastName", "userName", role FROM "user" WHERE id = $1;`, [userData.id])
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

  async getAllUsers() {
    const usersRequest = await db.query(`SELECT * FROM "user";`);
    const users = usersRequest.rows;

    return users;
  }
}

module.exports = new UserService();