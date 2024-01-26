const TokenModel = require('../model/token.model');
const { verifyJwtToken, generateAccessToken } = require('../utils/jwt-token');
const jwt = require('jsonwebtoken');

const revokeToken = async (req, res, next) => {
  const rToken = req.body.refreshToken;
  const tokenModel = await TokenModel.findOne({ token: rToken });

  if (!tokenModel) {
    return res.status(401).send({
      success: false,
      message: "Can't refresh. Invalid Token",
    });
  }

  await tokenModel.remove();
  res.status(200).send({
    success: true,
    message: 'Refresh token revoked',
  });
};
const refreshToken = async (req, res, next) => {
  const rToken = req.body.refreshToken;
  const tokenModel = await TokenModel.findOne({ token: rToken });

  if (!tokenModel) {
    return res.status(401).send({
      success: false,
      message: "Can't refresh. Invalid Token",
    });
  }

  try {
    const user = verifyJwtToken(tokenModel.token, next);
    if (!user) {
      await tokenModel.remove();
      return res.status(401).send({
        success: false,
        message: "Can't refresh. Invalid Token",
      });
    }
    const token = generateAccessToken({ id: user.id, type: user.type });
    tokenModel.accessToken = token;
    await tokenModel.save();
    res.status(200).send({
      success: true,
      token: token,
      refreshToken: refreshToken,
      message: 'User successfully logged in.',
    });
  } catch (err) {
    console.log({ err });
    if (err instanceof jwt.TokenExpiredError) {
      await tokenModel.remove();
      return next({
        status: 401,
        message: 'Refresh token Expired please re login',
      });
    }
    next(err);
  }
};

module.exports = {
  refreshToken,
  revokeToken,
};
