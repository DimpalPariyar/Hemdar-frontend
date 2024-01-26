const { default: mongoose } = require("mongoose");
const Product = require("../model/product.model");

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.aggregate([
      {
        $match: {
          Active: true,
        },
      },
      {
        $lookup: {
          from: "exchanges",
          localField: "exchangeId",
          foreignField: "_id",
          as: "exchangeDetails",
        },
      },
      {
        $unwind: "$exchangeDetails",
      },
      {
        $lookup: {
          from: "producttypes",
          localField: "productTypeId",
          foreignField: "_id",
          as: "producttypeDetails",
        },
      },
      {
        $unwind: "$producttypeDetails",
      },
      {
        $lookup: {
          from: "timeframes",
          localField: "timeFrameId",
          foreignField: "_id",
          as: "timeframeDetails",
        },
      },
      {
        $unwind: "$timeframeDetails",
      },
      {
        $project: {
          productTitle: 1,
          productShortDescription: 1,
          minInvestValue: 1,
          numberOfTradePerWeek: 1,
          Active: 1,
          exchangeName: "$exchangeDetails.name",
          productName: "$producttypeDetails.name",
          timeframeName: "$timeframeDetails.name",
        },
      },
    ]);

    return res.status(200).send({
      status: true,
      message: "Success",
      data: products,
    });
  } catch (error) {
    console.log(error);
    next();
  }
};

const getSingleProduct = async (req, res, next) => {
  const proId = req.params.productId;

  try {
    const product = await Product.findById(proId);
    const isSubscribed = res.locals.user.subscribedAdvisories.some((prod) => {
      for (const element of prod.relatedProductsIds) {
        if (element.toString() === proId) {
          return true;
        }
      }
      return prod._id.toString() === mongoose.Types.ObjectId(proId).toString();
    });
    const modifiedProduct = {
      ...product.toObject(),
      purchased: isSubscribed,
    };

    return res.status(200).send({
      status: true,
      message: "Success",
      data: modifiedProduct,
    });
  } catch (error) {
    console.log(error);
    next();
  }
};

module.exports = {
  getProducts: getProducts,
  getSingleProduct: getSingleProduct,
};
