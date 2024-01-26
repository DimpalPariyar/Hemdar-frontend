const jwt = require('jsonwebtoken');
const TokenModel = require('../model/token.model');

exports.generateAccessToken = (payload) => {
  return jwt.sign({ data: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXP,
  });
};

exports.addToList = async (userId, refreshToken, accessToken) => {
  const tokenModel = new TokenModel({
    user: userId,
    token: refreshToken,
    accessToken,
    status: 0,
  });
  return tokenModel.save();
};

exports.generateRefreshToken = (payload) => {
  return jwt.sign({ data: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXP,
  });
};

exports.verifyJwtToken = (token, next) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET).data;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next({
        status: 401,
        message: 'Auth token Expired please refresh the token',
      });
    }
    return next(err);
  }
};

exports.verifyJwtValidity = (token) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
};
