module.exports = (Collection, label) => {
  return async (req, res, next) => {
    try {
      const ids = req.body[label];
      if (ids) {
        for (let id of ids) {
          let isExist = await Collection.exists({ _id: id });
          if (!isExist) {
            return res.status(422).json({
              success: false,
              message:
                `No ` +
                Collection.collection.collectionName +
                ` found with id: ${id}`,
            });
          }
        }
      }
      next();
    } catch (e) {
      console.log(e);
      return res.status(422).json({
        success: false,
        message: e.message,
      });
    }
  };
};
