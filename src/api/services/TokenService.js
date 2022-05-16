const jwt = require('jsonwebtoken');
const db = require('../../config/db');

class TokenService {

  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1h'});
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});

    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await db.query(`SELECT * FROM token WHERE "userId" = $1`, [userId]);

    if(tokenData.rows.length > 0) {
      const updatedToken = await db.query(`UPDATE token SET refreshToken = $1 WHERE "userId" = $2`, [refreshToken, userId]);
      return updatedToken.rows[0].refreshToken;
    }
    const createdToken = await db.query(`SELECT * FROM createToken($1, $2);`, [userId, refreshToken]);
    return createdToken.rows[0].refreshToken;
  }
}

module.exports = new TokenService();