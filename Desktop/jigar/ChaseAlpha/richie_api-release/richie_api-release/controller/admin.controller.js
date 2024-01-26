const mongoose = require("mongoose");
const UserModel = require("../model/user.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
  addToList,
  verifyJwtValidity,
} = require("../utils/jwt-token");
const { userResponse } = require("../utils/user.transform");
const _ = require("lodash");
const { userAccess } = require("../data/constants");
const {
  getAllOrders,
  getAllSubscriptions,
  getAllNotifications,
} = require("./user.controller");
const { UserPermissions } = require("../data/constants");
const OrderModel = require("../model/order.model");
const TokenModel = require("../model/token.model");
const startSubscription = require("../model/subscription.model");
const CartModel = require("../model/cart.model");
const productModel = require("../model/product.model");
const subscriptionModel = require("../model/subscription.model");
const moment = require("moment");
const { getCKYCdata, downloadCKYCdata} = require("../service/digio_service");
const { SendSmsMessage, SendEmailOtp } = require("../service/authkey.service");
const ckycModel = require("../model/ckyc.model");
const orderModel = require("../model/order.model");
const { SendTemplateWhatsappMessage, SendOnetoOneWhatsappMessage } = require("../service/whatstool");
const productviseUserModel = require("../model/productviseUser.model");
const { triggerEmailForSecurityUpdate } = require("../service/aws_service");
const whatsappMsgModel = require("../model/whatsappMsg.model");


const me = async (req, res, next) => {
  res.status(200).send({
    success: true,
    message: "User details",
    data: userResponse(res.locals.user),
  });
};

const listAdmins = async (req, res, next) => {
  const admins = await UserModel.find({ type: { $gt: 0 }, deleted: false })
    .sort({ name: 1 })
    .lean();
  res.status(200).send({
    success: true,
    data: _.map(admins, userResponse),
  });
};

const listOfResearchs = async (req, res, next) => {
  try {
    const researchAdmin = await UserModel.find({
      type: {
        $size: 1,
        $all: [5],
      },
      deleted: false,
    })
      .sort({ name: 1 })
      .lean();
    res.status(200).send({
      success: true,
      data: researchAdmin,
    });
  } catch (error) {
    console.log(error);
  }
};

const listUsers = async (req, res, next) => {
  let id = req.params.id;
  const user = await UserModel.findById(id);
  res.status(200).send(user);
};

const listofUsersEmail = async(req,res,next)=>{
  try {
    
    const result = await UserModel.aggregate([
      {
        $project: {
          _id:0,
          value:"$_id",
         label: {
            $concat: [
              { $ifNull: ['$email', ''] }, // Use email or mobile if email is null
              '|',
              { $ifNull: ['$mobile', ''] } // Use mobile or empty string if mobile is null
            ]
          }  
        }
      }
    ])
    res.status(200).send(result)
  } catch (error) {
    
  }
}
const listOfUsers = async (req, res, next) => {
  let query = res.locals.query || {};
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const removedSpaceSearch = req.query.search;
  const search = removedSpaceSearch?.split(" ").join("");
  const verified = req.query.verified;
  const ckycverified = req.query.ckycverified
  const subscribedUser= req.query.subscribedUser
  const ckcypendingUser = req.query.ckycPending
  if (verified === "true") {
    query = {
      ...query,
      panNumber: { $nin: [null, ""] },
    };
  }

  if (verified === "false") {
    query = {
      ...query,
      panNumber: { $in: [null, ""] },
    };
  }
  try {
    if(subscribedUser === 'true'){
      const paidUsers = await orderModel.find({ status: "paid" });
      const usersid = [...new Set(paidUsers.map((id) => id.userId?._id.toString()))];
      query = {
        ...query,
        _id: { $in: usersid }
      }
    }
    if(ckycverified === 'true'){
      const Userswithckycdata = await ckycModel.find({}).select('userId')
      const UsersWithckycdataIds = Userswithckycdata.map((userId)=>userId.userId.toString())
      query = {
        ...query,
        _id: { $in: UsersWithckycdataIds }
      }
      console.log(query)
    }
    if(ckcypendingUser === 'true'){
      const paidUsers = await orderModel.find({ status: "paid" });
      const usersid = [...new Set(paidUsers.map((id) => id.userId?._id.toString()))];
      const Userswithckycdata = await ckycModel.find({}).select('userId')
      const UsersWithckycdataIds = Userswithckycdata.map((userId)=>userId.userId.toString())
      const ckycpendingUser=usersid.filter((userid)=>!UsersWithckycdataIds.includes(userid))
      query = {
        ...query,
        _id: { $in: ckycpendingUser }
      }
      console.log(query)
    }
    const count = await UserModel.countDocuments(query);
    if (search) {
      const regex = new RegExp(search, "i");
      const filter = {
        $or: [{ email: regex }, { mobile: regex }, { panNumber: regex }],
      };
      const accessIds = await UserModel.find(filter, "_id");
      query._id = { $in: accessIds.map((access) => access._id) };
    }
    const sort = { _id: -1 };
    const options = { sort };
    if (!isNaN(page) && !isNaN(limit)) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }

    // if(verified){
    //    const filter = {panNumber  };
    // }

    const users = await UserModel.find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip)
      .lean();

    const totalPages = Math.ceil(count / limit);
    const result = {
      page: page,
      size: users.length,
      total: count,
      pageTotal: totalPages,
      items: _.map(users, userResponse),
    };
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const getUserDetails = async (req, res, next) => {
  const emailId = req.body.email;
  const name = req.body.name;
  try {
    if (name) {
      const response = await UserModel.findOne({
        $or: [{ email: name }, { name: name }, { mobile: name }],
      });
      const Name = response.name;
      const mobile = response.mobile;
      const email = response.email;
      const panNumber = response.panNumber
      const subscribedAdvisories = response.subscribedAdvisories;
      const userId = response.id;
      const customNotification = response.customNotification
      const appVersion = response?.appVersion

      return res.status(200).send({
        userId,
        Name,
        mobile,
        email,
        panNumber,
        subscribedAdvisories,
        customNotification,
        appVersion
      });
    }
    if (emailId) {
      const response = await UserModel.findOne({ email: emailId });
      const mobile = response.mobile;
      const name = response.name;
      const address = response.address;
      const userId = response.id;

      return res.status(200).send({
        mobile,
        name,
        address,
        userId,
      });
    }
    return res.status(404).send({ message: "email not found" });
  } catch (e) {
    console.log(e);
  }
};

const listUsersSessions = async (req, res, next) => {
  const { sessionId } = req.query;
  try {
    const users = await UserModel.find({
      purchasedSessions: { $in: [sessionId] },
    }).lean();
    const data = _.map(users, (user) => {
      return {
        id: user._id,
        mobile: user.mobile,
        email: user.email,
        name: user.name,
      };
    });
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateSubscribedAdvisories = async (req, res, next) => {
  // Find the user that you want to update
  const advisoryid = req.body.advisoryValue;

  UserModel.findById(req.body.userId, (err, user) => {
    if (err) return res.status(500).send(err);
    // Set the value of the subscribedAdvisories field to the new array
    user.subscribedAdvisories = req.body.newSubscribedAdvisories;

    // Save the updated user
    user.save((err) => {
      if (err) return res.status(500).send(err);
      return res.send(user);
    });
  });
  try {
    if (advisoryid) {
      advisoryid.map((advice) => {
        if (advice.startdate && advice.enddate) {
          startSubscription.create({
            advisoryId: advice.value,
            userId: req.body.userId,
            startTime: advice.startdate,
            endTime: advice.enddate,
            active: true,
          });
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const getSubscribedAdvisories = async (req, res, next) => {
  UserModel.findById(req.query.userId, (err, user) => {
    if (err) return res.status(500).send(err);

    return res.send(user.subscribedAdvisories);
  });
};

const getPurchasedSessions = async (req, res, next) => {
  UserModel.findById(req.query.userId, (err, user) => {
    if (err) return res.status(500).send(err);
    return res.send(user.purchasedSessions);
  });
};

const updatePurchasedSessions = async (req, res, next) => {
  // Find the user that you want to update
  UserModel.findById(req.body.userId, (err, user) => {
    if (err) return res.status(500).send(err);

    // Set the value of the subscribedAdvisories field to the new array
    user.purchasedSessions = req.body.newPurchasedSessions;

    // Save the updated user
    user.save((err) => {
      if (err) return res.status(500).send(err);
      return res.send(user);
    });
  });
};

// const getSubscriptions = async (req, res, next) => {
//   let query = res.locals.query || {};
//   const page = parseInt(req.query.page);
//   const limit = parseInt(req.query.limit);
//   const removedSpaceSearch = req.query.search;
//   const search = removedSpaceSearch?.split(' ').join('');
//   const active = req.query.active;

//   if (active === 'true') {
//     query = {
//       ...query,
//       status: 'active',
//     };
//   }
//   if (active === 'false') {
//     query = {
//       ...query,
//       status: 'created',
//     };
//   }
//   try {
//     const { data, count } = await getAllSubscriptions(
//       page,
//       limit,
//       query,
//       search,
//       next
//     );
//     const totalPages = Math.ceil(count / limit);
//     const result = {
//       page: page,
//       size: data.length,
//       total: count,
//       pageTotal: totalPages,
//       items: data,
//     };
//     res.status(200).send(result);
//   } catch (e) {
//     console.log(e.message);
//     res.status(500).send(e);
//   }
// };

const getSubscriptions = async (req, res, next) => {
  let query = res.locals.query || {};
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const removedSpaceSearch = req.query.search;
  const search = removedSpaceSearch?.split(" ").join("");
  const active = req.query.active;
  const date = req.query.date;
  const now = new Date();
  const endOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 7
  );
  if (date === "true") {
    query = {
      ...query,
      endTime: {
        $gte: now,
        $lt: endOfWeek,
      },
    };
  }
  if (active === "true") {
    query = {
      ...query,
      active: true,
    };
  }
  if (active === "false") {
    query = {
      ...query,
      status: false,
    };
  }
  try {
    const { data, count } = await getAllSubscriptions(
      page,
      limit,
      query,
      search,
      next
    );
    const totalPages = Math.ceil(count / limit);
    const result = {
      page: page,
      size: data.length,
      total: count,
      pageTotal: totalPages,
      items: data,
    };
    res.status(200).send(result);
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e);
  }
};

const getOrders = async (req, res, next) => {
  let query = res.locals.query || {};
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const removedSpaceSearch = req.query.search;
  const product = req.query.product;
  const search = removedSpaceSearch?.split(" ").join("");
  const paid = req.query.paid;

  if (paid === "true") {
    query = {
      ...query,
      status: "paid",
    };
  }
  if (paid === "false") {
    query = {
      ...query,
      status: "created",
    };
  }
  if (product) {
    query = {
      ...query,
      product: product,
    };
  }
  // if(product){
  //   query ={
  //     ...query,
  //   advisoryId:product
  //   }
  // }

  try {
    const { data, count, productCount } = await getAllOrders(
      page,
      limit,
      query,
      search,
      next
    );
    const totalPages = Math.ceil(count / limit);
    const result = {
      page: page,
      size: data.length,
      total: count,
      pageTotal: totalPages,
      items: data,
      productCount: productCount,
    };
    res.status(200).send(result);
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e);
  }
};
const getNotifications = async (req, res, next) => {
  let query = res.locals.query || {};
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  query.userId = req.query.subscribedUsers;
  try {
    const { data, count } = await getAllNotifications(page, limit, query, next);
    const totalPages = Math.ceil(count / limit);
    const result = {
      page: page,
      size: data.length,
      total: count,
      pageTotal: totalPages,
      items: data,
    };
    res.status(200).send(result);
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e);
  }
};

const GenerateSaleReport = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startDate = req.query.startDate.slice(0, 19) + "Z";
  const endDate = req.query.endDate.slice(0, 19) + "Z";
  try {
    const sort = { _id: -1 };
    const options = { sort };

    if (!isNaN(page) && !isNaN(limit)) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }
    let data = await OrderModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
      deleted: { $ne: true },
      status: "paid",
    })
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip);
    const count = await OrderModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      deleted: { $ne: true },
      status: "paid",
    });
    const totalPages = Math.ceil(count / limit);
    const reportdata = _.map(data, (data) => {
      let product = [];
      let invoicenumber;

      if (data.programSessions?.length > 0) {
        product = data.programSessions.map((product) => product.sessionName);
      }
      if (data.advisoryId) {
        product[0] = data.advisoryId.productTitle;
      }

      if (data.invoiceUrl) {
        const str = data.invoiceUrl;
        let regex = /_(\d+)\.pdf$/;
        let match = str.match(regex);
        let number;
        if (match) {
          number = match[1]; // get the first capturing group
        } else {
          console.log("No match found"); // handle the case when there is no match
        }
        invoicenumber = number;
      }
      return {
        orderId: data._id,
        userId: data.userId?._id,
        createdAt: data.createdAt,
        Product: product[0],
        address: data.billingId?.address || "",
        company: data.billingId?.company || "",
        state: data.billingId?.state || "",
        gstNo: data.billingId?.gstNo || "",
        email: data.userId?.email || "",
        mobile: data.userId?.mobile || "",
        name: data.userId?.name || "",
        TotalAmount: data.totalAmount / 100,
        GstAmount: data?.listGst / 100,
        Amount: data?.listAmount / 100,
        AmountPaid: data?.amount_paid / 100,
        invoicenumber: invoicenumber || "",
      };
    });
    const gst = await CartModel.find({ gst: { $exists: true } }); // get all gst no form cart collection
    const gstdata = gst.map((user) => {
      return {
        gstNo: user.gst,
        userId: user.userId?._id,
      };
    }); // map to get only gstno and userid field from cart model
    reportdata.map((gst) => {
      const found = gstdata.find((item) => {
        return item?.userId?.equals(gst.userId);
      }); // map the orders and if condition match update the gst no
      if (found) {
        gst.gstNo = found.gstNo;
      } else {
        gst.gstNo = "";
      }
    });

    const result = {
      page: page,
      size: data.length,
      total: count,
      pageTotal: totalPages,
      items: reportdata,
    };
    res.status(200).send(result);
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e);
  }
};

const attemptedSalesreport = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startDate = req.query.startDate.slice(0, 19) + "Z";
  const endDate = req.query.endDate.slice(0, 19) + "Z";
  try {
    const sort = { _id: -1 };
    const options = { sort };

    if (!isNaN(page) && !isNaN(limit)) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }

    let distinctuserId = await OrderModel.distinct("userId", {
      status: "paid",
    });
    let attemptedOrder = await OrderModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: "created",
      userId: { $nin: distinctuserId },
    })
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip);
    const count = await OrderModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      status: "created",
      userId: { $nin: distinctuserId },
    });
    const totalPages = Math.ceil(count / limit);
    const reportdata = _.map(attemptedOrder, (data) => {
      let product = [];
      if (data.programSessions?.length > 0) {
        product = data.programSessions.map((product) => product.sessionName);
      }
      if (data.advisoryId) {
        product[0] = data.advisoryId.productTitle;
      }

      return {
        orderId: data._id,
        userId: data.userId?._id,
        createdAt: data.createdAt,
        Product: product[0],
        address: data.billingId?.address || "",
        state: data.billingId?.state || "",
        email: data.userId?.email || "",
        mobile: data.userId?.mobile || "",
        name: data.userId?.name || "",
        TotalAmount: data.totalAmount / 100,
      };
    });
    const result = {
      page: page,
      size: attemptedOrder.length,
      total: count,
      pageTotal: totalPages,
      items: reportdata,
    };
    res.status(200).send({ result });
    if (reportdata.length === 0) {
      res.status(400).send({ message: "no attemted order found" });
    }
  } catch (err) {
    console.log(err);
  }
};
const getSingleOrder = async (req, res, next) => {
  let id = req.params.id;
  try {
    if (id) {
      const data = await OrderModel.findById(id);
      res.status(200).send(data);
    }
  } catch (e) {
    res.send(400).send(e);
  }
};

const UpdateOrder = async (req, res, next) => {
  let id = req.params.id;
  const data = req.body;
  try {
    OrderModel.findByIdAndUpdate(id, data).then(async(data) => {
      if (!data) {
        res.status(400).send({
          message: "cannot update OrderModel",
        });
        if(data.subscriptionId){
          await subscriptionModel.findOneAndUpdate({_id:data.subscriptionId},{
            active:false
          })
          await productviseUserModel.updateOne({
            productId:data.advisoryId
          },{
             $pull:{
              listofuserId:{
                id:data.userId
              }
             }
          })
        }
      } else res.status(200).send(data);
    });
  } catch (e) {
    res.status(500).send({ message: "server error" });
  }
};

const createOrder = async (req, res, next) => {
  const orderId = new mongoose.Types.ObjectId();
  const {
    advisoryId,
    subscriptionId,
    totalAmount,
    listGst,
    listAmount,
    razorPayOrderId,
    created_at,
    UserId,
    duration,
    amount,
    gstNumber,
    status,
    amount_paid,
  } = req.body;

  const order = await OrderModel.create({
    _id: orderId,
    advisoryId: advisoryId,
    subscriptionId: subscriptionId,
    userId: UserId,
    totalAmount: totalAmount,
    razorPayOrderId: razorPayOrderId,
    amount: amount,
    amount_paid: amount_paid,
    status: status,
    created_at: new Date(created_at),
    listGst: listGst,
    listAmount: listAmount,
    gst: gstNumber,

    // agreementId: cart.documentId,
  });

  res.status(200).json({
    success: true,
    message: "Order is created successfully",
    amountToBePaid: order.totalAmount,
    orderId: order._id,
    razorPayOrderId: order.razorPayOrderId,
  });
};

const checkIfLoggedIn = async (userId) => {
  const token = await TokenModel.findOne({ user: userId });
  if (!token) {
    return;
  }
  await token.remove();
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Check errors below",
      errors: errors.array(),
    });
  }
  const { email, password } = req.body;
  try {
    let user = await UserModel.findOne({
      email,
    });
    if (!user)
      return res.status(400).json({
        message: "User Not Exist",
      });
    if (!user.password)
      return res.status(400).json({
        message: "User password not set, contact admin",
      });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        message: "Incorrect Password !",
      });
    if (user.status === 0)
      return res.status(401).json({
        message: "User is banned",
      });

    await checkIfLoggedIn(user._id);
    const accessToken = generateAccessToken({ id: user._id, type: user.type });
    const refreshToken = generateRefreshToken({
      id: user._id,
      type: user.type,
    });
    await addToList(user._id, refreshToken, accessToken);
    user.lastLogin = user.currentLogin;
    user.currentLogin = Date.now();
    await user.save();
    console.log({ UserPermissions });
    res.status(200).send({
      success: true,
      token: accessToken,
      refreshToken: refreshToken,
      message: "Admin successfully logged in.",
      UserPermissions,
    });
  } catch (e) {
    next(e);
  }
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Check errors below",
      errors: errors.array(),
    });
  }
  const { email, name, mobile, password, type } = req.body;
  console.log(type);
  let user = new UserModel({
    mobile,
    name,
    email,
    password,
    type,
    status: 1,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();
  res.status(200).send({
    success: true,
    message: "New Admin has been Created",
  });
};

const changePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Check errors below",
      errors: errors.array(),
    });
  }
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();
  res.status(200).send({
    success: true,
    message: "New Password updated",
  });
};

const userRights = async (req, res, _) => {
  res.status(200).send(userAccess);
};

const changePermissions = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Check errors below",
      errors: errors.array(),
    });
  }
  const { userId, type } = req.body;
  try {
    await UserModel.updateOne({ _id: userId }, { $set: { type } });
    res.status(200).send({
      success: true,
      message: "changed admin with new access",
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const changeResearchUserAcess = async (req, res, next) => {
  const errors = validationResult(req);
  let accesstype;
  let createAccess;
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Check errors below",
      errors: errors.array(),
    });
  }
  const { userId, access } = req.body;
  try {
    if (access.viewAccess) {
      viewAccess = access.viewAccess;
      await UserModel.updateOne({ _id: userId }, { $set: { viewAccess } });
      res.status(200).send({
        success: true,
        message: "viewAccess updated succesfully",
      });
    }
    if (access.createAccess) {
      createAccess = access.createAccess;
      await UserModel.updateOne({ _id: userId }, { $set: { createAccess } });
      res.status(200).send({
        success: true,
        message: "createAccess updated successfully",
      });
    }
    if (access.updateAccess) {
      updateAccess = access.updateAccess;
      await UserModel.updateOne({ _id: userId }, { $set: { updateAccess } });
      res.status(200).send({
        success: true,
        message: "updateAccess updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const deleteAccount = async (req, res, next) => {
  const { userId, isUser } = req.body;
  try {
    if (isUser) {
      const user = await UserModel.findOne({
        _id: userId,
        deleted: true,
      });
      if (!user) {
        return next({
          message: "No delete account request found by user",
          status: 404,
        });
      }

      await user.remove();
    } else {
      await UserModel.updateOne(
        { _id: body.userId },
        { $set: { deleted: true } }
      );
    }

    await TokenModel.deleteOne({ user: userId });

    res.status(200).send({
      success: true,
      message: "The account has been successfully deleted",
    });
  } catch (e) {
    next(e);
  }
};

const banAdmin = async (req, res, next) => {
  const { userId, enable } = req.body;
  const statusValue = enable ? 1 : 0;
  try {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { status: statusValue } }
    );
    res.status(200).send({
      success: true,
      message: "The Admin has been successfully updated",
    });
  } catch (e) {
    next(e);
  }
};

const getCollections = (req, res, next) => {
  const models = mongoose.modelNames();
  res.status(200).send(models);
};

const removeAllDocuments = async (collection, models) => {
  const modelExists = _.includes(models, collection);
  if (modelExists) {
    try {
      const documents = await mongoose.model(collection).find();
      for (let i = 0; i < documents.length; i++) {
        await documents[i].remove();
      }
    } catch (error) {
      throw new Error(error);
    }
  }
};

const clearCollections = async (req, res, next) => {
  const { collections } = req.body;
  const models = mongoose.modelNames();

  try {
    for (let i = 0; i < collections.length; i++) {
      await removeAllDocuments(collections[i], models);
    }
    res.status(200).send({
      message: "Collection is cleared",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const logout = async (req, res, next) => {
  let user = res.locals.user._id;
  const { isUser, userId } = req.body;
  if (isUser && userId) {
    user = userId;
  }

  try {
    const token = await TokenModel.findOne({ user });
    token && (await token.remove());
    res.status(200).send({});
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const logoutUserDevice = async (req, res, next) => {
  const { contact } = req.body;
  const user = await UserModel.findOne({
    $or: [{ email: contact }, { mobile: contact }],
  }).lean();

  if (!user) {
    return next({
      status: 404,
      message: `No user found with ${contact}`,
    });
  }

  const token = await TokenModel.find({
    user: user._id,
  });
  if (!token) {
    return next({
      status: 404,
      message: `No user logged in with ${contact}`,
    });
  }
  console.log(token);
  token && (await TokenModel.deleteMany({ user: user._id }));
  res.status(200).send({ message: "User logged out successfully" });
};

const createUser = async (req, res, next) => {
  const { email, mobile } = req.body;
  if (!email && !mobile) {
    return next({
      status: 400,
      message: "Both Email and Mobile cannot be empty",
    });
  }
  const contact = {};
  if (email) {
    contact.email = email;
  } else if (mobile) {
    contact.mobile = mobile;
  }
  try {
    await UserModel.create(contact);
    res.status(200).send({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const UpdateGstNo = async (req, res, next) => {
  const pipeline = [
    // Match stage to filter documents based on a condition
    {
      $match: {
        userId: { $exists: true }, // Add any additional conditions if needed
      },
    },
    // Group stage to group documents by 'userId' and accumulate unique numbers
    {
      $group: {
        _id: "$userId",
        gst: { $addToSet: "$gst" },
      },
    },
  ];

  CartModel.aggregate(pipeline).then((result) => {
    result.forEach(async (doc) => {
      const { _id, gst } = doc;
      let gstNo = "";
      if (gst.length > 0) gstNo = gst[0];
      await OrderModel.updateMany(
        { userId: { $eq: _id } },
        { $set: { gst: gstNo } }
      );
    });
    console.log("mapping of gst no to orders is complete");
    res
      .status(200)
      .send({ message: "mapping of gst no to orders is complete" });
  });
};

async function getProductSubCount(req, res, next) {
  try {
    let productSubCount = [];
    let totalcount;
    let monthcount;
    let sixtydayscount;
    let quatercount;
    let updateproductviseUser=[]
    const product = await productModel.find({}).select("productTitle");
    const subscription = await subscriptionModel
      .find({ active: true })
      .populate(["advisoryId"])
      .populate(["userId"])
      const prouductviseuser = await productviseUserModel.find()
    productSubCount = product.map((title) => {
      totalcount = subscription.filter(
        (advisoryTitle) =>
          title.productTitle === advisoryTitle.advisoryId?.productTitle
      ).map(user=>{return {id:user.userId?._id,name:user.userId?.name,mobile:user.userId?.whatsappnumber,email:user.userId?.email}});
      // console.log(title.productTitle ,totalcount.map(user=>{return {id:user.userId?._id,name:user.userId?.name}}))
      monthcount = totalcount.filter((date) => {
        const diff = moment(date.startTime).diff(moment(date.endTime), "days");
        return Math.abs(diff) === 30;
      });
      sixtydayscount = totalcount.filter((date) => {
        const diff = moment(date.startTime).diff(moment(date.endTime), "days");
        return Math.abs(diff) === 60;
      });
      quatercount = totalcount.filter((date) => {
        const diff = moment(date.startTime).diff(moment(date.endTime), "days");
        return Math.abs(diff) === 90;
      });
      const productuser = prouductviseuser.filter((id)=>id.productId.toString()===title._id.toString())
      updateproductviseUser.push({productId:title._id.toString(),listofuserId:totalcount})
      // if(productuser[0]?.listofuserId?.length !== totalcount.length){
      // }
      // console.log(title.productTitle,productuser[0].listofuserId.length,totalcount.length)
      return {
        product: title.productTitle,
        totalcount: totalcount.length,
        monthcount: monthcount.length,
        sixtydayscount: sixtydayscount.length,
        quatercount: quatercount.length,
        users:totalcount,
        productId:title._id
      };
    });
    // console.log(updateproductviseUser)
    if(updateproductviseUser.length >0){
      for(let i =0;i<updateproductviseUser.length;i++){
        const update= await productviseUserModel.findOneAndUpdate({productId:updateproductviseUser[i].productId},{listofuserId:updateproductviseUser[i].listofuserId})
        console.log(update)
      }
    }
    // const listofuserSubscribed = [...new Set(subscription.map((userId)=>userId.userId?._id.toString()))]
    // if(prouductviseuser.length !==productSubCount.length ){

    //   const insertmanyproductviseuser = productSubCount.map((user)=>{
    //     return {
    //       productId:user.productId,
    //       listofuserId:user.users
    //     }
    //   })
    //   await productviseUserModel.insertMany(insertmanyproductviseuser)
    // }
    if (productSubCount) {
      productSubCount = productSubCount.filter(items =>items.users.length !== 0)
      res.status(200).send({
        item: productSubCount,
      });
    } else {
      res.status(404).send({
        message: "something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
  }
}
const getCKYCdatafromPanNumber = async(req,res,next)=>{
  const panNumber = req.body.panNumber
  const dob = req.body.dob
  const userId = req.body.userId
  try {
      // const response = await getCKYCdata(panNumber)
      // let download
      // if(response.success){
      //   download = await downloadCKYCdata(dob,response.search_response.ckyc_number)
      // }
      const success = await getCkycDataandStoreInDb(userId,panNumber,dob)
      res.status(200).send({dbStatus:success})
    } catch (error) {
      
    }
}

const ckycBulkStorebackdated = async (req, res, next) => {
  try {
    const batchSize = 2;
    const delayBetweenBatches = 6000; 
    const paidUsers = await orderModel.find({ status: "paid" });
    const usersid = [...new Set(paidUsers.map((id) => id.userId?._id.toString()))];
    const Userswithckycdata = await ckycModel.find({}).select('userId')
    const UsersWithckycdataIds = Userswithckycdata.map((userId)=>userId.userId.toString())
    const usersID=usersid.filter((userid)=>!UsersWithckycdataIds.includes(userid))
    const userdata = await UserModel.find({ _id: { $in: usersID } }).select(
      'panNumber dob'
    );
    let ckycdata = [];
    // let downloadckyc = [];
    let ckycerrormsg = [];

    for (let i = 0; i < userdata.length; i += batchSize) {
      const batchPromises = userdata.slice(i, i + batchSize).map(async (user) => {
        try {
          const response = await getCKYCdata(user?.panNumber);
          if (response?.success) {
            const savedResponse = await saveCKYCData(response, user);
            if (savedResponse.success) {
              ckycdata.push(`Saved CKYC data for user: ${user.panNumber}\n`);
            } else {
              ckycerrormsg.push({
                data: `Error saving CKYC data for user: ${user.panNumber} - ${savedResponse?.error_message}`,
              });
            }
          }else {
            ckycerrormsg.push({
              data: `${response?.error_message} for this pan: ${user.panNumber}`,
            });
          }
          
        } catch (error) {
          console.error(`Error processing user ${user.panNumber}: ${error.message}`);
          ckycerrormsg.push({
            data: `Error processing user ${user.panNumber}: ${error.message}`,
          });
        }
      });

      await Promise.all(batchPromises);
      if (i + batchSize < userdata.length) {
        await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
      }
    }
    res.status(200).send({"Total User":userdata.length,"Total Success":ckycdata.length, "Total Failures":ckycerrormsg})
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

async function saveCKYCData(response, user) {
  const userDob = moment(user.dob).format('DD-MM-YYYY')
  const downloadresponse = await downloadCKYCdata(
    userDob,
    response.search_response.ckyc_number
  );
  const savedData = {
    userId: user._id,
    ckycDownloadData: downloadresponse?.download_response,
    ...response.search_response
  };

  try {
    const result = await ckycModel.create(savedData);
    return { success: true, result };
  } catch (error) {
    console.error(`Error saving CKYC data: ${error.message}`);
    return { success: false, error_message: `Error saving CKYC data: ${error.message}` };
  }
}

const userCkycdata = async(req,res,next)=>{
  const userid = mongoose.Types.ObjectId(req.params.id)
  try {
    const getuserckyc = await ckycModel.findOne({userId:userid})
    if(getuserckyc){
      const result = {
        ckyc_number:getuserckyc?.ckyc_number,
        name:getuserckyc?.name,
        fathers_name: getuserckyc?.fathers_name,
        age: getuserckyc?.age,
        image_type: getuserckyc?.image_type,
        photo:getuserckyc?.photo, 
        kyc_date:getuserckyc.kyc_date,
        updated_date:getuserckyc?.updated_date,
        remarks: getuserckyc?.remarks,
        ckyc_prefix:getuserckyc?.ckyc_prefix,
        listofProof:getuserckyc?.ckycDownloadData?.images
      };
      res.status(200).send(result)
    }
    if(!getuserckyc){
      res.status(400).send({message:'no ckyc data found'})
    }
    
  } catch (error) {
    res.status(500).send({message:'something went wrong'})
  }
}
const whatsapp = async(req,res,next)=>{
  const startTime = new Date();
  // await SendTemplateWhatsappMessage(['8097567290','7506511376'],'123456')
  const response = await SendOnetoOneWhatsappMessage('8097567290','This is the test we are doing on whatsapp using api')
  const endTime = new Date();
        const executionTime = endTime - startTime;
        console.log(`Execution time: ${executionTime} milliseconds`);
        res.status(200).send(response)
}
const OnetoOneWhatsappMsg = async(req,res,next)=>{
try {
  const whatsappbody = req.body
  const number = req.body.number
  const userId = req.body.userId
  const response = await SendOnetoOneWhatsappMessage(number,whatsappbody.body)
//   const data = [{
//     number:'8097567290',
//     name:'jigar'
//   },{
//     number:'7506511376',
//     name:'sir'
//   },
// ]
//   const whatsapp = {
//     user: "Jigar",
//     action: "BUY",
//     underlying: "Nifty",
//     expiry: "21OCT2023",
//     strike: "19500",
//     optiontype: "CE",
//     entry: "100-200",
//     stoploss: "90",
//     target: "105-120-140",
//   };
//    const response = await SendTemplateWhatsappMessage(data,whatsapp)
  if(response){
    await whatsappMsgModel.create({
      messagebody:`${whatsappbody.body}`,
    usermobile:number,
    userId:userId
    })
    res.status(200).send({message:'Whatsapp Message send Sucessfully'})
  }
  if(!response) {
    res.status(400).send({message:'could not send the Message'})
  }
} catch (error) {
  console.log(error)
}
}
const sendSms = async(req,res,next)=>{
  try {
    const response = await SendSmsMessage('8097567290','564654')
    
    res.status(200).send(response)
  } catch (error) {
    console.log(error)
  }
}

const syncUserSubscription = async(req,res,next)=>{
  const userid = req.params.id
  try {
    const UserSubscription = await subscriptionModel.find({userId:userid,active:true})
    const userID  = UserSubscription.map((id)=>id.advisoryId.toString())
    function findRepeatingProduct(arr) {
      const uniqueElements = new Set();
      const repeatingElements = arr.filter((element) => {
        if (uniqueElements.has(element)) {
          return true; // Element is repeating
        }
        uniqueElements.add(element);
        return false; // Element is not repeating
      });
      return Array.from(new Set(repeatingElements)); // Remove duplicates from repeatingElements
    }
    const repeatedproduct = findRepeatingProduct(userID)
    if(repeatedproduct.length === 0){
      return res.status(200).send({message:'no common products'})
     }
    // console.log(repeatedproduct)
    for(let i = 0; i<repeatedproduct.length ; i++){
      const commonproduct = UserSubscription.filter((id)=>id.advisoryId.toString() === repeatedproduct[i])
      if(commonproduct.length === 0){
       return res.status(200).send({message:'no common products'})
      }
      // console.log(commonproduct)
      const  latestSubscription = commonproduct.reduce((max, current) => {
        const startdate = new Date(current.startTime);
        const maxstartdate = new Date(max.startTime);
        return startdate > maxstartdate ? current : max;
      }, UserSubscription[0]);
      const  oldestSubscription = commonproduct.reduce((max, current) => {
        const startdate = new Date(current.startTime);
        const maxstartdate = new Date(max.startTime);
        return startdate < maxstartdate ? current : max;
      }, UserSubscription[0]);
      console.log(latestSubscription,oldestSubscription)
      const startday = new Date(latestSubscription.startTime);
      const endday = new Date(latestSubscription.endTime);
      const datediff = endday-startday
      const differenceInDays = datediff / (1000 * 60 * 60 * 24);
      const enddateforlatestsub = new Date(oldestSubscription.endTime);
      enddateforlatestsub.setDate(enddateforlatestsub.getDate() + differenceInDays);
      console.log(latestSubscription._id)
      const result = await subscriptionModel.findOneAndUpdate({_id:latestSubscription._id},{
        startTime:oldestSubscription.endTime,
        endTime:enddateforlatestsub.toISOString()
      })
    }
    res.status(200).send({message:'updated successfully'})
  } catch (error) {
    console.log(error)
  }
}

const syncscbscriptioncollection = async (req, res, next) => {
  try {
    // Find orders with advisoryId and status 'paid'
    const orders = await orderModel.find({ advisoryId: { $exists: true }, status: 'paid' });
    console.log(orders.length)
    // Extract subscriptionIds from the orders
    const subscriptionIds = orders.map((order) => order.subscriptionId);

    // Find all subscriptions related to these orders
    const allSubscriptionsForOrders = await subscriptionModel.find({ _id: { $in: subscriptionIds } });
    // Find all subscriptions in the subscriptionModel collection
    const allSubscriptions = await subscriptionModel.find({});
    
    // Extract all subscription IDs
    const allSubscriptionIds = allSubscriptions.map((subscription) => subscription._id.toString());
    
    // Extract subscription IDs related to orders
    const allSubscriptionForOrdersIds = allSubscriptionsForOrders.map((subscription) => subscription._id.toString());

    // Find subscription IDs to delete (not related to any orders)
    const subscriptionDeleteIds = allSubscriptionIds.filter((id) => !allSubscriptionForOrdersIds.includes(id.toString()));
   console.log(subscriptionDeleteIds.length)
    // Update the 'deleted' property to true for the subscriptions to delete
    const updateResult = await subscriptionModel.updateMany(
      { _id: { $in: subscriptionDeleteIds } },
      { $set: { deleted: true } }
    );
   
    // console.log('Subscriptions updated:', updateResult);

    res.status(200).send({ message: 'Subscriptions updated' ,updateResult,subscriptionDeleteIds});
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

const sendEmailforCyberSecurityUpdates = async(req,res,next)=>{
  // try {
  //   const pipeline = [
  //     {
  //       $unwind: "$listofuserId", // Unwind the list of users arrays
  //     },
  //     {
  //       $group: {
  //         _id: "$listofuserId",
  //         products: {
  //           $addToSet: "$productId", // Collect unique product IDs for each user
  //         },
  //       },
  //     },
  //   ];
  //   await productviseUserModel.aggregate(pipeline).exec(async(err, result) => {
  //     if (err) {
  //       console.error("Error:", err);
  //       return;
  //     }

  //     // `result` now contains a list of unique users and the products they are associated with
  //     const useremail = result.map((user) => {
  //       if(Object.keys(user).length === 0){
  //         return ''
  //       }
  //       if(user?._id.id === null){
  //         return ''
  //       }
  //       if(user?._id?.email === null){
  //         return ''
  //       }
  //       return user?._id?.email
  //     });
  //     // Filter out null values
  //     const filteredArray = useremail.filter((email) => email !== null);
  //     // Remove duplicate emails using Set
      
  //   });
  try {
    const batchSize = 10; // Number of users to process in each batch

 
  // await sendNotification(subScribedfilterUsersType, title, body, dataId,url,
  //   notificationImage, next);
    const usersforallorders = await orderModel.find({status:'paid'}).populate('userId')
    const emailArray = usersforallorders.map((email)=>email?.userId?.email)
    const filteredArray = emailArray.filter((email) => email !== undefined && email !== null && email !== '');
    const allemails = [...new Set(filteredArray)];
    console.log(allemails)
    const response =[]
    for (let i = 0; i < allemails.length; i += batchSize) {
      const usersBatch = allemails.slice(i, i + batchSize);
  
      const res =  await triggerEmailForSecurityUpdate(usersBatch)
      response.push(res)
    }
    
    res.status(200).send({response,allemails});
  } catch (error) {
    
  }
}

module.exports = {
  login,
  signUp,
  userRights,
  changePermissions,
  changeResearchUserAcess,
  me,
  changePassword,
  listAdmins,
  listOfResearchs,
  deleteAccount,
  banAdmin,
  listUsers,
  listOfUsers,
  getOrders,
  getNotifications,
  getSubscriptions,
  updateSubscribedAdvisories,
  updatePurchasedSessions,
  getSubscribedAdvisories,
  getPurchasedSessions,
  listUsersSessions,
  getSingleOrder,
  UpdateOrder,
  clearCollections,
  getCollections,
  logout,
  logoutUserDevice,
  getUserDetails,
  createOrder,
  createUser,
  GenerateSaleReport,
  UpdateGstNo,
  getProductSubCount,
  attemptedSalesreport,
  listofUsersEmail,
  getCKYCdatafromPanNumber,
  ckycBulkStorebackdated,
  whatsapp,
  sendSms,
  userCkycdata,
  saveCKYCData,
  syncUserSubscription,
  syncscbscriptioncollection,
  sendEmailforCyberSecurityUpdates,
  OnetoOneWhatsappMsg,
};
