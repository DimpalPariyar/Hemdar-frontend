// const { query } = require("express");
const ChatModel = require("../model/chat.model");
const { mongoose } = require("mongoose");
const { NotifyProduct } = require("./newnotification.controller");
const adviceModel = require("../model/advice.model");
const userModel = require("../model/user.model");
const { ObjectId } = require("mongodb");
const { sendNotification } = require("../service/one_signal");
const notificationModel = require("../model/notification.model");
const userNotificationModel = require("../model/userNotification.model");
const productviseUserModel = require("../model/productviseUser.model");
const newnotificationModel = require("../model/newnotification.model");
const productModel = require("../model/product.model");

const createMessage = async(messageBody)=>{
 try {
  const message = new ChatModel(messageBody);
    await message.save();
 } catch (error) {
  console.log(error)
 }
}


const postMessage = async (req, res, next) => {
  const messageBody = req.body;
  
  try {
  
    const message = new ChatModel(messageBody);
    await message.save();
    
    if(message.adviceId){
      let productIds=[...messageBody?.productId]
      // const advice = await adviceModel.findById(message.adviceId)
      const comboProduct = await productModel.find({
        relatedProductsIds:{$in:productIds}
      })
      if (comboProduct.length > 0) {
        comboProduct.forEach((product) => productIds.push(product._id.toString()));
      }
      console.log(productIds)
      const subcribedUser = await productviseUserModel.find({productId:{$in:productIds}})
      const alluserid = [...new Set(subcribedUser.map((user)=>user.listofuserId.map((id)=>id?.id?.toString())).flat())]
      const subcribedUserIDs = [...new Set(alluserid)]
      console.log(subcribedUserIDs)
      await sendNotification(
        subcribedUserIDs,
        title=message.title,
        body=message.description,
        message.adviceId,
        message.productUrl,
        message.imageUrl, 
        true,
        next
      );
      // NotifyProduct(
      //     productIds=messageBody.productId,
      //     notificationTitle=message.title,
      //     notificationBody=message.description,
      //     undefined,
      //     undefined,
      //     _id=message.adviceId,
      //     targetAudience=message.productType[0],
      //     typeOfNotification="6520030fb85d0aae430fb90f",
      //     insturmentId=advice.instrumentId,
      //     message.productUrl,
      //     message.imageUrl
      //     )
      }
    if(!message.subscription){
      // const objecttypeID = mongoose.Types.ObjectId(advice.typeOfNotification);
      const alluser = await userModel.aggregate([
        {
          $unwind: "$customNotification", // Unwind the data array
        },
        {
          $match: {
            // "customNotification.notificationTypeid": objecttypeID,
            "customNotification.status": true, // Match documents with data.status as true
          },
        },
        {
          $group: {
            _id: null, // Group by the user _id
            userIds: { $addToSet: "$_id" },
          },
        },
      ]);
      const AlluserID = alluser[0].userIds;
      await sendNotification(
        AlluserID,
        title=message.title,
        body=message.description,
        undefined,
        message.productUrl,
        message.imageUrl,
        true,
        next
      );
      // const objecttypeID = mongoose.Types.ObjectId("6520030fb85d0aae430fb90f");
      // const notification = await newnotificationModel.create({
      //   body:message.description,
      //   title:message.title,
      //   notificationType:objecttypeID ,
      //   targetAudience: "Everyone",
      // });
      // const insertmanyDocument = AlluserID.map((dataID) => ({
      //   notificationid: notification._id,
      //   readStatus: false,
      //   userId: dataID,
      // }));
      // await userNotificationModel.insertMany(insertmanyDocument);
    }
    if(message.subscription && !message.adviceId){
      let productIds=[...messageBody?.productId]
      // const advice = await adviceModel.findById(message.adviceId)
      const comboProduct = await productModel.find({
        relatedProductsIds:{$in:productIds}
      })
      if (comboProduct.length > 0) {
        comboProduct.forEach((product) => productIds.push(product._id.toString()));
      }
      console.log(productIds)
      const subcribedUser = await productviseUserModel.find({productId:{$in:messageBody.productId}})
      const alluserid = [...new Set(subcribedUser.map((user)=>user.listofuserId.map((id)=>id?.id?.toString())).flat())]
      const subcribedUserIDs = [...new Set(alluserid)]
      await sendNotification(
        subcribedUserIDs,
        title=message.title,
        body=message.description,
        undefined,
        message.productUrl,
        message.imageUrl, 
        true,
        next
      );
      // const objecttypeID = mongoose.Types.ObjectId("6520030fb85d0aae430fb90f");
      // const notification = await newnotificationModel.create({
      //   body:message.description,
      //   title:message.title,
      //   notificationType: objecttypeID,
      //   targetAudience: "Everyone",
      // });
      // const insertmanyDocument = subcribedUserIDs.map((dataID) => ({
      //   notificationid: notification._id,
      //   readStatus: false,
      //   userId: dataID,
      // }));
      // await userNotificationModel.insertMany(insertmanyDocument);
    }
    
    return res.status(200).send({
      success: true,
      message: "messages response",
      data: message,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// const getChatMessages = async (req, res, next) => {
//   try {
//     const { limit = 10, skip = 0, productId, adviceId, searchText } = req.body;
//     // Extract userSubscribedAdvicers
//     const userSubscribedAdvicers = extractUserSubscribedAdvicers(
//       res.locals.user.subscribedAdvisories
//     );
//     console.log(`User Subscriptions : ${userSubscribedAdvicers}`);
//     // Build query based on input conditions
//     const query = buildQuery(
//       productId,
//       adviceId,
//       searchText,
//       userSubscribedAdvicers,
//       res.locals.user
//     );
//     const messages = await ChatModel.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();
//     return res.status(200).send({
//       success: true,
//       length: messages.length,
//       message: "messages response",
//       data: messages,
//     });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

// Extract userSubscribedAdvicers
const extractUserSubscribedAdvicers = (subscribedAdvisories) => {
  const userSubscribedAdvicers = [];

  subscribedAdvisories.forEach((element) => {
    if (element.relatedProductsIds.length === 0) {
      userSubscribedAdvicers.push(element._id);
    } else {
      element.relatedProductsIds.forEach((id) => {
        userSubscribedAdvicers.push(id);
      });
    }
  });

  return userSubscribedAdvicers;
};

// Build the query based on input conditions
const buildQuery = (
  productId,
  adviceId,
  searchText,
  userSubscribedAdvicers,
  user
) => {
  const query = {};

  if (searchText) {
    query.$text = { $search: searchText };
  }

  if (productId) {
    const existsComboProduct = user.subscribedAdvisories.some((element) => {
      if (element._id.toString() === productId.toString()) {
        element.relatedProductsIds.forEach((a) => {
          userSubscribedAdvicers.push(a);
        });
        return true;
      }
      return false;
    });

    if (existsComboProduct) {
      query.$or = [
        { subscription: false },
        { productId: { $in: userSubscribedAdvicers } },
      ];
    } else {
      query.$or = [
        { subscription: false },
        { productId: mongoose.Types.ObjectId(productId) },
      ];
    }
  } else {
    query.$or = [
      { subscription: false },
      { productId: { $in: userSubscribedAdvicers } },
    ];
  }

  if (adviceId) {
    query.$or = [
      {
        $and: [
          { subscription: false },
          { adviceId: { $exists: false } },
          { productId: { $exists: false } },
        ],
      },
      { productId: mongoose.Types.ObjectId(productId) },
      { adviceId: mongoose.Types.ObjectId(adviceId) },
    ];
  }

  return query;
};

const getAllChatmessage = async (req, res, next) => {
  try {
    const allChatMessage = await ChatModel.find({})
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).send(allChatMessage);
  } catch (error) {
    console.log(error);
  }
};

const getChatMessages = async (req, res, next) => {
  const limit = parseInt(req.body.limit) || 10;
  const skip = parseInt(req.body.skip) || 0;
  const productId = req.body.productId;
  const adviceId = req.body.adviceId;
  const searchText = req.body.searchText;

  const userSubscribedAdvicers = [];
  res.locals.user.subscribedAdvisories.forEach((element) => {
    if (element.relatedProductsIds.length === 0) {
      userSubscribedAdvicers.push(element._id);
    } else {
      element.relatedProductsIds.forEach((id) => {
        userSubscribedAdvicers.push(id);
      });
    }
  });
  console.log(userSubscribedAdvicers);
  const queary = {};
  const isComboProduct = res.locals.user.subscribedAdvisories.map(
    (ele) => ele._id
  );
  const existsComboProduct = isComboProduct.some((objectId) =>
    objectId.equals(mongoose.Types.ObjectId(productId))
  );
  const exists = userSubscribedAdvicers.some((objectId) =>
    objectId.equals(mongoose.Types.ObjectId(productId))
  );
  console.log(exists);
  if (searchText !== null && searchText !== undefined && searchText !== "") {
    queary.$text = {
      $search: searchText,
    };
  }
  if (productId !== null && productId !== undefined && productId !== "") {
    if (exists) {
      queary.$or = [
        { subscription: false },
        {
          productId: mongoose.Types.ObjectId(productId),
        },
      ];
    } else if (existsComboProduct) {
      var existingQuery = [];
      existingQuery.push({ subscription: false });
      res.locals.user.subscribedAdvisories.forEach((element) => {
        if (element._id.toString() === productId.toString()) {
          element.relatedProductsIds.forEach((a) => {
            existingQuery.push({ productId: a });
          });
        }
      });
    } else {
      queary.$or = [{ subscription: false }];
    }
  } else {
    queary.$or = [
      { subscription: false },
      {
        productId: {
          $in: userSubscribedAdvicers,
        },
      },
    ];
  }
  if (adviceId !== null && adviceId !== undefined && adviceId !== "") {
    queary.$or = [
      {
        $and: [
          { subscription: false },
          { adviceId: { $exists: false } },
          { productId: { $exists: false } },
        ],
      },
      { productId: mongoose.Types.ObjectId(productId) },
      { adviceId: mongoose.Types.ObjectId(adviceId) },
    ];
  }

  try {
    const messages = await ChatModel.find(queary)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return res.status(200).send({
      success: true,
      length: messages.length,
      message: "messages response",
      data: messages,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

module.exports = {
  getChatMessages: getChatMessages,
  postMessage: postMessage,
  getAllChatmessage,
  createMessage
};
