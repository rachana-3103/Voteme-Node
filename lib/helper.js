const jwt = require('jsonwebtoken');
const _ = require('lodash');

const jwtSignUser = (user) => {
  const ONE_WEEK = global.CONFIG['token']['expired'];
  return jwt.sign(user, global.CONFIG['jwt']['JWT_SECRET'], {
    expiresIn: ONE_WEEK,
  });
};

module.exports = {
  jwtSignUser,
};
