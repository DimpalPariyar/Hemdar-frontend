const _ = require('lodash');

module.exports = () => {
  return async (req, res, next) => {
    if (req.query) {
      const queries = [];
      _.forEach(req.query, (value, key) => {
        if (key !== 'page' && key !== 'limit' && key !== 'search') {
          const query = {};
          query[key] = { $in: value.split(',').map((val) => val.trim()) };
          queries.push(query);
        }
      });
      if (queries.length !== 0) {
        res.locals.query = {
          $and: queries,
        };
      }
    }
    next();
  };
};
