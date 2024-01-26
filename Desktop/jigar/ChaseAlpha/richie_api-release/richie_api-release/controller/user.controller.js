const UserModel = require("../model/user.model");
const AppVersionModel = require("../model/appversion.model");
const OTPModel = require("../model/otp.model");
const { validationResult } = require("express-validator");
const PanModel = require("../model/pan.model");
const riskScores = require("../data/self_risk.json");
const { userResponse } = require("../utils/user.transform");
const {
  userGender,
  userResidentialStatus,
  userStatus,
  userRedirectionBroker,
} = require("../data/constants");
// const SubscriptionModel = require('../model/subscriptionOrder.model');
const OrderModel = require('../model/order.model');
const _ = require('lodash');
const TokenModel = require('../model/token.model');
const UserSubscriptionModel = require('../model/subscription.model');
const NotificationModel = require('../model/notification.model');
const userNotificationModel = require('../model/userNotification.model');
const notificationTypeModel = require('../model/notificationType.model');
const whatsappMsgModel = require('../model/whatsappMsg.model');
const userBrokerModel = require("../model/userBroker.model");
const { getZerodhaUserProfile, PlaceZerodhaTradeOrder } = require("../service/kite_connect");

const userGenderTypes = async (req, res, _) => {
  res.status(200).send(userGender);
};

const redirectionBrokerTypes = async (req, res, _) => {
  res.status(200).send(userRedirectionBroker);
};

const userResidentialTypes = async (req, res, _) => {
  res.status(200).send(userResidentialStatus);
};

const userStatusTypes = async (req, res, _) => {
  res.status(200).send(userStatus);
};

const getUser = async (req, res, next) => {
  try {
    const appversion = await AppVersionModel.findOne();
    res.locals.user.newAppVersion = appversion.appversion
    console.log(appversion);
    return res.status(200).send({
      success: true,
      message: "User details",
      data: userResponse(res.locals.user),
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getUserRiskProfile = async (req, res, next) => {
  const user = res.locals.user;
  const total = user.score;
  let scoreName = "";
  let scoreDescription = "";
  riskScores.map((item) => {
    if (item.low <= total && item.high >= total) {
      scoreName = item.name;
      scoreDescription = item.description;
    }
  });
  const scoreDetails = {
    total,
    scoreName,
    scoreDescription,
  };
  res.status(200).send({
    success: true,
    data: scoreDetails,
  });
};

const confirmName = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Check errors below",
      errors: errors.array(),
    });
  }
  try {
    const userId = res.locals.user._id;
    const validPan = await PanModel.findOne({
      $and: [
        { user: userId },
        { panNumber: req.body.panNumber },
        { name: req.body.name },
      ],
    });

    if (validPan) {
      UserModel.updateOne(
        { _id: userId },
        {
          $set: {
            panNumber: req.body.panNumber,
            name: req.body.name,
          },
        },
        function (err, doc) {
          if (err) next(err);
          else {
            res.status(200).send({
              success: true,
              message: "Pan Confirmed",
            });
          }
        }
      );
    } else {
      res.status(422).send({
        success: false,
        message:
          "Pan not confirmed, please verify pan and then confirm the name",
      });
    }
  } catch (e) {
    next(e);
  }
};

const updateDetails = async (req, res, next) => {
  const userId = res.locals.user._id;
  const body = req.body;
  const user = await UserModel.findOne({ _id: userId });
  if (user) {
    try {
      if (body.dob) {
        user.dob = body.dob;
      }
      if (body.gender) {
        user.gender = body.gender;
      }
      if (body.residential) {
        user.residential = body.residential;
      }
      if (body.address) {
        user.address = body.address;
      }
      if (body.redirectionBroker) {
        user.redirectionBroker = body.redirectionBroker;
      }
      if (body.customNotification) {
        user.customNotification.push(body.customNotification);
      }
      await user.save();
      res.status(200).send({
        success: true,
        message: "Details Updated",
      });
    } catch (e) {
      next(e);
    }
  } else {
    res.status(422).send({
      success: false,
      message: "User not found",
    });
  }
};

const verifyDetails = async (req, res, next) => {
  const userId = res.locals.user._id;
  const body = req.body;
  const user = await UserModel.findOne({ _id: userId });
  if (user) {
    try {
      const { email, mobile, otp } = body;
      if (email === undefined && mobile === undefined) {
        next(new Error("Both Email and Mobile cannot be empty"));
        return;
      }
      const validOTP = await OTPModel.findOne({
        mobile,
        email,
        otp,
        status: 0,
        expireIn: { $gte: new Date().getTime() },
      });
      if (validOTP) {
        await OTPModel.updateOne(
          { _id: validOTP._id },
          { $set: { status: 1 } }
        );
        if (validOTP.email) {
          user.email = validOTP.email;
        }
        if (validOTP.mobile) {
          user.mobile = validOTP.mobile;
        }
        await user.save();
        res.status(200).send({
          success: true,
          message: "Details Updated",
        });
      } else {
        res.status(422).send({
          success: false,
          message: "Invalid OTP, please try again",
        });
      }
    } catch (e) {
      next(e);
    }
  } else {
    res.status(422).send({
      success: false,
      message: "User not found",
    });
  }
};

async function getAllOrders(page, limit, query, search, next) {
  try {
    if (search) {
      const regex = new RegExp(search, "i");
      const filter = {
        $or: [{ name: regex }, { email: regex }, { mobile: regex }],
      };
      const userIds = await UserModel.find(filter, "_id");
      query.userId = { $in: userIds.map((user) => user._id) };
    }
    const sort = { _id: -1 };
    const options = { sort };
    if (!isNaN(page) && !isNaN(limit)) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }

    const count = await OrderModel.countDocuments({
      ...query,
      deleted: { $ne: true },
    });
    let data = await OrderModel.find({ ...query, deleted: { $ne: true } })
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip);

    if (search) {
      const regex = new RegExp(search, "i");
      const filter = {
        $or: [{ name: regex }, { email: regex }, { mobile: regex }],
      };
      const userIds = await UserModel.find(filter, "_id");
      const userId = { $in: userIds.map((user) => user._id) };
      const filterId = {
        $or: [{ razorPayOrderId: regex }, { userId: userId }],
      };
      data = await OrderModel.find(filterId);
    }

    if (query.product) {
      const sort = { _id: -1 };
      const options = { sort };
      const wholedata = await OrderModel.find({
        deleted: { $ne: true },
      }).sort(options.sort);

      switch (query.product) {
        case "Cash Stocks Poisitional":
          data = wholedata.filter(
            (m) =>
              m.advisoryId?.productTitle === "Cash Stocks Poisitional" &&
              m.status === "paid"
          );
          if (!isNaN(page) && !isNaN(limit)) {
            const skip = (page - 1) * limit;
            data = data.slice(skip, data.length);
          }
          return { data, count: data.length };
          break;
        case "Energy & Gas":
          data = wholedata.filter(
            (m) =>
              m.advisoryId?.productTitle === "Energy & Gas" &&
              m.status === "paid"
          );
          if (!isNaN(page) && !isNaN(limit)) {
            const skip = (page - 1) * limit;
            data = data.slice(skip, data.length);
          }
          return { data, count: data.length };
          break;
        case "Metals":
          data = wholedata.filter(
            (m) =>
              m.advisoryId?.productTitle === "Metals" && m.status === "paid"
          );
          if (!isNaN(page) && !isNaN(limit)) {
            const skip = (page - 1) * limit;
            data = data.slice(skip, data.length);
          }
          return { data, count: data.length };
          break;
        case "NIFTY Options":
          data = wholedata.filter(
            (m) =>
              m.advisoryId?.productTitle === "NIFTY Options" &&
              m.status === "paid"
          );
          if (!isNaN(page) && !isNaN(limit)) {
            const skip = (page - 1) * limit;
            data = data.slice(skip, data.length);
          }
          return { data, count: data.length };
          break;
        case "Bang Bang BANKNIFTY":
          data = wholedata.filter(
            (m) =>
              m.advisoryId?.productTitle === "Bang Bang BANKNIFTY" &&
              m.status === "paid"
          );
          if (!isNaN(page) && !isNaN(limit)) {
            const skip = (page - 1) * limit;
            data = data.slice(skip, data.length);
          }
          return { data, count: data.length };
          break;
        case "Momentum Futures":
          data = wholedata.filter(
            (m) =>
              m.advisoryId?.productTitle === "Momentum Futures" &&
              m.status === "paid"
          );
          if (!isNaN(page) && !isNaN(limit)) {
            const skip = (page - 1) * limit;
            data = data.slice(skip, data.length);
          }
          return { data, count: data.length };
          break;
        case "Index Futures":
          data = wholedata.filter(
            (m) =>
              m.advisoryId?.productTitle === "Index Futures" &&
              m.status === "paid"
          );
          if (!isNaN(page) && !isNaN(limit)) {
            const skip = (page - 1) * limit;
            data = data.slice(skip, data.length);
          }
          return { data, count: data.length };
          break;
        case "Bullion":
          data = wholedata.filter(
            (m) =>
              m.advisoryId?.productTitle === "Bullion" && m.status === "paid"
          );
          if (!isNaN(page) && !isNaN(limit)) {
            const skip = (page - 1) * limit;
            data = data.slice(skip, data.length);
          }
          return { data, count: data.length };
          break;
        case "Options Combo":
          data = wholedata.filter(
            (m) =>
              m.advisoryId?.productTitle === "Options Combo" &&
              m.status === "paid"
          );
          if (!isNaN(page) && !isNaN(limit)) {
            const skip = (page - 1) * limit;
            data = data.slice(skip, data.length);
          }
          return { data, count: data.length };
          break;
        case "Index Option Combo":
          data = wholedata.filter(
            (m) =>
              m.advisoryId?.productTitle === "Index Option Combo" &&
              m.status === "paid"
          );
          if (!isNaN(page) && !isNaN(limit)) {
            const skip = (page - 1) * limit;
            data = data.slice(skip, data.length);
          }
          return { data, count: data.length };
          break;
        case "Futures Combo":
          data = wholedata.filter(
            (m) =>
              m.advisoryId?.productTitle === "Futures Combo" &&
              m.status === "paid"
          );
          if (!isNaN(page) && !isNaN(limit)) {
            const skip = (page - 1) * limit;
            data = data.slice(skip, data.length);
          }
          return { data, count: data.length };
          break;
        case "Stock Options":
          data = wholedata.filter(
            (m) =>
              m.advisoryId?.productTitle === "Stock Options" &&
              m.status === "paid"
          );
          if (!isNaN(page) && !isNaN(limit)) {
            const skip = (page - 1) * limit;
            data = data.slice(skip, data.length);
          }
          return { data, count: data.length };
          break;
      }
    }
    const wholedata = await OrderModel.find({
      deleted: { $ne: true },
    }).sort(options.sort);
    const productCount = {
      cashstockpositionCount: wholedata.filter(
        (m) =>
          m.advisoryId?.productTitle === "Cash Stocks Poisitional" &&
          m.status === "paid"
      ).length,
      energyandgasCount: wholedata.filter(
        (m) =>
          m.advisoryId?.productTitle === "Energy & Gas" && m.status === "paid"
      ).length,
      metalCount: wholedata.filter(
        (m) => m.advisoryId?.productTitle === "Metals" && m.status === "paid"
      ).length,
      niftyoptionCount: wholedata.filter(
        (m) =>
          m.advisoryId?.productTitle === "NIFTY Options" && m.status === "paid"
      ).length,
      bangbangniftyCount: wholedata.filter(
        (m) =>
          m.advisoryId?.productTitle === "Bang Bang BANKNIFTY" &&
          m.status === "paid"
      ).length,
      momentfutureCount: wholedata.filter(
        (m) =>
          m.advisoryId?.productTitle === "Momentum Futures" &&
          m.status === "paid"
      ).length,
      indexfutureCount: wholedata.filter(
        (m) =>
          m.advisoryId?.productTitle === "Index Futures" && m.status === "paid"
      ).length,
      bullionCount: wholedata.filter(
        (m) => m.advisoryId?.productTitle === "Bullion" && m.status === "paid"
      ).length,
      optioncomboCount: wholedata.filter(
        (m) =>
          m.advisoryId?.productTitle === "Options Combo" && m.status === "paid"
      ).length,
      indexoptioncomboCount: wholedata.filter(
        (m) =>
          m.advisoryId?.productTitle === "Index Option Combo" &&
          m.status === "paid"
      ).length,
      futurecomboCount: wholedata.filter(
        (m) =>
          m.advisoryId?.productTitle === "Futures Combo" && m.status === "paid"
      ).length,
      stockoptionCount: wholedata.filter(
        (m) =>
          m.advisoryId?.productTitle === "Stock Options" && m.status === "paid"
      ).length,
    };
    return { data, count, productCount };
  } catch (e) {
    console.log(e);
    next(e);
  }
}

async function getAllNotifications(page, limit, query, next) {
  try {
    const sort = { _id: -1 };
    const options = { sort };
    if (!isNaN(page) && !isNaN(limit)) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }

    const count = await userNotificationModel.countDocuments({
      ...query,
    });
    const data = await userNotificationModel
      .find({ ...query })
      .populate("notificationid")
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip);

    return { data, count };
  } catch (e) {
    console.log(e);
    next(e);
  }
}

const getOrders = async (req, res, next) => {
  try {
    let query = res.locals.query || {};
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const search = parseInt(req.query.search);
    query["userId"] = res.locals.user._id;
    let result = await getAllOrders(page, limit, query, search, next);
    res.status(200).send(result.data);
  } catch (e) {
    console.log(e.message);
    next(e);
  }
};

const getSingleOrderDetails = async (req, res, next) => {
  console.log(req.params.id);
  const id = req.params.id;
  try {
    const order = await OrderModel.findById(id);
    res.status(200).send({ data: order });
  } catch {}
};
async function getAllSubscriptions(page, limit, query, search, next) {
  try {
    const count = await UserSubscriptionModel.countDocuments(query);
    if (search) {
      const regex = new RegExp(search, "i");
      const filter = {
        $or: [{ name: regex }, { email: regex }, { mobile: regex }],
      };
      const userIds = await UserModel.find(filter, "_id");
      query.userId = { $in: userIds.map((user) => user._id) };
    }
    const sort = { _id: -1 };
    const options = { sort };
    if (!isNaN(page) && !isNaN(limit)) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }
    const data = await UserSubscriptionModel.find(query)
      .populate(["advisoryId", "userId", "planId"])
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip);
    return { data, count };
  } catch (e) {
    console.log(e);
    next(e);
  }
  // if (!isNaN(page) && !isNaN(limit)) {
  //   const data = await SubscriptionModel.find(query, null, {
  //     sort: { _id: -1 },
  //     skip: (page - 1) * limit,
  //     limit: limit,
  //   });
  //   const count = await SubscriptionModel.countDocuments(query);
  //   return { data, count };
  // } else {
  //   const data = await SubscriptionModel.find(query, null, {
  //     sort: { _id: -1 },
  //   });
  //   const count = await SubscriptionModel.countDocuments(query);
  //   return { data, count };
  // }
}

// const getSubscriptions = async (req, res, next) => {
//   let query = res.locals.query || {};
//   const page = parseInt(req.query.page);
//   const limit = parseInt(req.query.limit);
//   query['userId'] = res.locals.user._id;
//   try {
//     const result = await getAllSubscriptions(page, limit, query);
//     res.status(200).send(result.data);
//   } catch (e) {
//     console.log(e.message);
//     next(e);
//   }
// };
const getSubscriptions = async (req, res, next) => {
  const userId = res.locals.user._id;
  try {
    const result = await UserSubscriptionModel.find({
      userId,
      active: true,
    }).populate(["planId", "advisoryId", "userId"]);
    res.status(200).send(result);
  } catch (e) {
    console.log(e.message);
    next(e);
  }
};

const getGenralNotifications = async (req, res, next) => {
  try {
    const userId = res.locals.user._id;
    var user = await UserModel.findById(userId);
    res.status(200).send({
      success: true,
      message: "User notification settings",
      data: user.generalNotification,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateGenralNotifications = async (req, res, next) => {
  try {
    const userId = res.locals.user._id;
    var user = await UserModel.findById(userId);
    user.generalNotification.whatsappNotifications =
      req.body.whatsappNotifications;
    user.generalNotification.pushNotifications = req.body.pushNotifications;
    user.generalNotification.smsNotifications = req.body.smsNotifications;
    await user.save();
    res.status(200).send({
      success: true,
      message: "User notification settings updated",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getCustomNotifications = async (req, res, next) => {
  const userId = res.locals.user._id;
  try {
    const user = await UserModel.findById(userId);
    await user.populate("customNotification.notificationTypeid", "-__v");
    res.status(200).send({
      status: false,
      message: "Success",
      data: user.customNotification,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateCustomNotifications = async (req, res, next) => {
  const userId = res.locals.user._id;
  const notificationId = req.body.id;
  const status = req.body.status;
  try {
    const user = await UserModel.findById(userId);
    await user.populate("customNotification.notificationTypeid", "-__v");
    user.customNotification.filter((element) => {
      if (notificationId === undefined || notificationId === null) {
        element.status = status;
      } else {
        if (element.notificationTypeid._id == notificationId) {
          element.status = status;
        }
      }
    });
    await user.save();
    res.status(200).send({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const logout = async (req, res, next) => {
  const user = res.locals.user._id;

  try {
    const token = await TokenModel.findOne({ user });
    await token.remove();
    res.status(200).send({});
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const udpateCustomarray = async (req, res, next) => {
  let userid = req.body.userId;
  console.log(userid, req.body);
  try {
    const typeofNotification = await notificationTypeModel.find({});
    const result = typeofNotification.map((typenotification) => {
      return {
        typeOfNotification: typenotification.typeofNotification,
        notificationTypeid: typenotification._id,
        status: true,
      };
    });
    await UserModel.findOneAndUpdate(
      { _id: userid },
      { $unset: { customNotification: 1 } }
    );
    await UserModel.findOneAndUpdate(
      { _id: userid },
      { $set: { customNotification: result } }
    );
    res.status(200).send({ message: "custom Array updated successfully" });
  } catch (error) {
    console.log(error);
  }
}

const listofUserWhatsappMsg = async (req,res,next)=>{
  try {
    // let query = res.locals.query || {};
    const userID  = req.query.userId
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const sort = { _id: -1 };
  const options = { sort };
  if (!isNaN(page) && !isNaN(limit)) {
    options.skip = (page - 1) * limit;
    options.limit = limit;
  }
  const count = await whatsappMsgModel.countDocuments({userId:userID});
  const listofUserMsg = await whatsappMsgModel.find({userId:userID}).sort(options.sort)
  .limit(options.limit)
  .skip(options.skip);
  
  console.log(listofUserMsg)
    const totalPages = Math.ceil(count / limit);
    const result = {
      page: page,
      size: listofUserMsg.length,
      total: count,
      pageTotal: totalPages,
      items: listofUserMsg,
    };
    if(!listofUserMsg){
       res.status(400).send({message :'No Message found for this  user'})
    }
       res.status(200).send(result)
  } catch (error) {
    console.log(error)
  }
}

const getZerodhaProfile = async(req,res,next)=>{
   const userid = req.params.id
  try {
  const broker = await userBrokerModel.findOne({
    user:userid
  })
  const userProfile = await getZerodhaUserProfile(broker.apiKey,broker.accessToken)
  if(userProfile){
    res.status(200).send(userProfile)
  }else {
    res.status(400).send({message:'broker User Profile Not found'})
  }
} catch (error) {
  
}
}
const placeTradeOrderonZerodha = async(req,res,next)=>{
  const tradedetails = req.body 
  try {
   const broker = await userBrokerModel.findOne({
    user:tradedetails.userId
   })  
   const orderID = await PlaceZerodhaTradeOrder(broker.apiKey,broker.accessToken,tradedetails)
   if(orderID){
    res.status(200).send({message:'order Executed successfully',
    orderID})
   }else{
    res.status(400).send({message:'order Failed'})
   }
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  getUser,
  confirmName,
  updateDetails,
  verifyDetails,
  getUserRiskProfile,
  userResidentialTypes,
  userGenderTypes,
  redirectionBrokerTypes,
  userStatusTypes,
  getSubscriptions,
  getOrders,
  getSingleOrderDetails,
  getAllOrders,
  getAllNotifications,
  getAllSubscriptions,
  getGenralNotifications,
  updateGenralNotifications,
  getCustomNotifications,
  updateCustomNotifications,
  logout,
  udpateCustomarray,
  listofUserWhatsappMsg,
  getZerodhaProfile,
  placeTradeOrderonZerodha
};
