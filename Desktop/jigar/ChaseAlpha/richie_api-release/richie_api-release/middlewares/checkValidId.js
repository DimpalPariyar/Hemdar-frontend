module.exports = (Collection, label) => {
  return async (req, res, next) => {
    try {
      const id = req.body[label];
      if (id) {
        let isIdExist = await Collection.exists({ _id: id }).setOptions({
          strictQuery: false,
        });
        if (!isIdExist) {
          const query = {};
          query[label] = id;
          isIdExist = await Collection.exists(query).setOptions({
            strictQuery: false,
          });
          if (!isIdExist) {
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
