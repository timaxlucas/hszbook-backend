const expressJwt = require('express-jwt');
const { secret } = require('../config.json');
const userService = require('../modules/users/user.service');
const logger = require('./logger');

module.exports = authorize;

function authorize(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === 'string')
    roles = [roles];

  return [
    // authenticate JWT token and attach user to request object (req.user)
    expressJwt({
      secret,
      isRevoked, // revoke token if user no longer exists
      requestProperty: 'user',
      getToken: function fromHeaderOrQuerystring(req) {
        // try to get jwt token either from header or query param
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
          return req.headers.authorization.split(' ')[1];
        else if (req.query && req.query.token)
          return req.query.token;

        return null;
      }
    }),

    // authorize based on user role
    (req, res, next) => {
      // user fulfilling all required rolls?
      if (roles.length && roles.filter(el => req.user.roles.indexOf(el) === -1).length !== 0) {
        // user's role is not authorized
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // authentication and authorization successful
      next();
    }
  ];
}

async function isRevoked(req, payload, done) {
  const user = await userService.getByMail(payload.user);

  // revoke token if user no longer exists
  if (!user) {
    logger.info('authorization revoked', { source: 'auth' });
    return done(null, true);
  }

  done();
}