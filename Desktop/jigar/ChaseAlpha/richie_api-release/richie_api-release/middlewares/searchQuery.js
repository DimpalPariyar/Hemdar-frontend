const { buildToQuery } = require('./buildToQuery');
module.exports = (...fields) => {
  return async (req, res, next) => {
    if (req.query) {
      const search = req.query.search;
      if (search) {
        let queries = {};
        queries = {
          $or: [
            ...fields.map((field) => ({
              [field]: { $regex: `.*${search}.*`, $options: 'i' },
            })),
          ],
        };
        res.locals.query = buildToQuery(res, queries);
      }
    }
    next();
  };
};
