const jwt = require('jsonwebtoken');
const { JWEB_TOKEN_KEY } = require('../utils/secrets');
const { logger } = require('./logger');
const { UNAUTHORIZED } = require('../constants/statusCodes');
const {error} = require('../utils/response');

//console.log(require('crypto').randomBytes(64).toString('hex'));

    
const generate = (profile) => jwt.sign({ 
      profile
     }, JWEB_TOKEN_KEY, { expiresIn: '7d'});

const verify = (token) => {
    return jwt.verify(token, JWEB_TOKEN_KEY, (err, decoded) => {
    if (err || !decoded) {
      const errorMsg = {
        code: UNAUTHORIZED,
        message: (err&&err.name&&
          err.name==='TokenExpiredError'
            ?'Session expired. Please sign in.'
            :'No authentication provided.'),
      }
      console.log('err: ', err);
      logger.error(errorMsg);
      return errorMsg;
    }
    //console.log(decoded.email);
    return decoded
    });
}

module.exports = {
    generate,
    verify
}