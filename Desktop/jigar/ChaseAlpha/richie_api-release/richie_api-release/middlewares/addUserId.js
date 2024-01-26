module.exports = () => {
  return async (req, res, next) => {
    if (res.locals.user.hasPermission === 0) {
      res.locals.body = req.body;
      res.locals.body['userId'] = res.locals.user._id;
    }
    next();
  };
};
