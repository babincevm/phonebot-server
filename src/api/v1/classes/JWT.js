const jwt = require('jsonwebtoken');
const Environment = require('./Environment');


class JWT {
  async sign(payload, audience) {
    return await jwt.sign({},
      Environment.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '10s',
        issuer: Environment.SITE_URL,
        audience,
      },
    );
  }

  verify(token) {
    return jwt.verify(token, Environment.ACCESS_TOKEN_SECRET);
  }

  async refresh() {

  }
}


module.exports = new JWT();
