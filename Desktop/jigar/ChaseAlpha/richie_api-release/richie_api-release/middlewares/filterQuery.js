const _ = require('lodash');
const moment = require('moment');
const { buildToQuery } = require('./buildToQuery');
const removeSessionsThatArePast = () => {
  return async (req, res, next) => {
    if (res.locals.user.hasPermission === 0) {
      res.locals.query = buildToQuery(res, {
        date: {
          $gt: moment()
            .add(this.closeSessionAfter || 30, 'minutes')
            .toDate(),
        },
      });
    }
    next();
  };
};

const sortOrder = (fieldName) => {
  return async (req, res, next) => {
    res.locals.sort = { [fieldName]: 'asc' };
    console.log(res.locals);
    next();
  };
};
const removePurchased = (lookupField, userPurchasedField) => {
  return async (req, res, next) => {
    if (res.locals.user.hasPermission === 0) {
      res.locals.query = buildToQuery(res, {
        [lookupField]: {
          $nin: _.map(
            res.locals.user[userPurchasedField],
            (product) => product._id
          ),
        },
      });
    }
    next();
  };
};

const purchased = (lookupField, userPurchasedField) => {
  return async (req, res, next) => {
    if (res.locals.user.hasPermission === 0) {
      res.locals.purchased = _.map(
        res.locals.user[userPurchasedField],
        (product) => product._id.toString()
      );
    }
    next();
  };
};

const onlyPurchased = (lookupField, userPurchasedField) => {
  return async (req, res, next) => {
    if (res.locals.user.hasPermission === 0) {
      res.locals.query = buildToQuery(res, {
        [lookupField]: {
          $in: _.map(
            res.locals.user[userPurchasedField],
            (product) => product._id
          ),
        },
      });
    }
    next();
  };
};

const addRelatedProducts = (
  lookupField,
  userPurchasedField,
  lookupFieldSecondary,
  Collection
) => {
  return async (req, res, next) => {
    if (res.locals.user.hasPermission === 0) {
      let products = await Collection.find({
        [lookupField]: {
          $in: _.map(
            res.locals.user[userPurchasedField],
            (product) => product._id
          ),
        },
      }).lean();

      const { advisoryId } = req.query;
      if (advisoryId) {
        products = products.filter((product) => {
          return product._id.toString() === advisoryId;
        });
      }
      let advisoryIds = [];
      _.forEach(products, (product) => {
        product && advisoryIds.push(product._id);
        product.relatedProductsIds &&
          product.relatedProductsIds.length &&
          advisoryIds.push(...product.relatedProductsIds);
      });
      res.locals.query = buildToQuery(res, {
        [lookupFieldSecondary]: {
          $in: advisoryIds,
        },
      });
    }
    next();
  };
};

const isPurchased = (lookupField, userPurchasedField) => {
  return async (req, res, next) => {
    if (res.locals.user.hasPermission === 0) {
      const purchasedIds = _.map(
        res.locals.user[userPurchasedField],
        (product) => product._id.toString()
      );
      if (
        _.includes(purchasedIds, req.body[lookupField]) ||
        _.includes(purchasedIds, req.query[lookupField])
      ) {
        next();
      } else {
        res
          .status(422)
          .send({ message: "Looks like the user haven't purchased" });
      }
    } else {
      next();
    }
  };
};

module.exports = {
  removeSessionsThatArePast,
  removePurchased,
  onlyPurchased,
  addRelatedProducts,
  purchased,
  isPurchased,
  sortOrder,
};
