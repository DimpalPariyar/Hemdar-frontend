const _ = require('lodash');

module.exports = (Collection, label, field) => {
  return async (req, res, next) => {
    try {
      const relationalData =
        (res.locals && res.locals.body && res.locals.body[label]) ??
        req.body[label];
      if (relationalData) {
        const insertIds = await Promise.all(
          _.map(relationalData, async (data) => {
            if (data._id) {
              const doc = await Collection.findOneAndUpdate(
                { _id: data._id },
                { $set: data },
                { new: true }
              );
              return doc._id;
            } else {
              const relationalData = new Collection(data);
              const doc = await relationalData.save(data);
              return doc._id;
            }
          })
        );
        res.locals.body = req.body;
        res.locals.body[field] = insertIds;
        next();
      } else {
        next();
      }
    } catch (e) {
      console.log(e);
      return res.status(422).json({
        success: false,
        message: e.message,
      });
    }
  };
};
