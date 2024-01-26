const NotificationModel = require("../model/newnotification.model");
const UserModel = require("../model/user.model");
const { sendNotification } = require("../service/one_signal");
const notificationTypeModel = require("../model/notificationType.model");
const { ObjectId } = require("mongodb");
const userNotification = require("../model/userNotification.model");
const mongoose = require("mongoose");
const _ = require("lodash");
const userNotificationModel = require("../model/userNotification.model");
const productModel = require("../model/product.model");
const adminlistofNotificationModel = require("../model/adminlistofNotification.model");
const {instrument} = require('../model/genericSingleValue.model');
const productviseUserModel = require("../model/productviseUser.model");
const { SendTemplateWhatsappMessage } = require("../service/whatstool");
const whatsappMsgModel = require("../model/whatsappMsg.model");

const NotifyProduct = async (
  productIds,
  title,
  body,
  unSubTitle,
  unSubBody,
  dataId,
  targetAudience,
  typeOfNotification,
  insturmentId,
  url,
  notificationImage,
  whatsapp,
  next
) => {
  // const objecttypeID = mongoose.Types.ObjectId(typeOfNotification);
  // let productIDs 
  // if(productIds.length === 1){
  //   let relatedproductids = [mongoose.Types.ObjectId(productIds[0])]
  //   const products = await productModel.find({
  //     relatedProductsIds:{$in:productIds}
  //   })
  //     if (products.length) {
  //       products.forEach((product) => relatedproductids.push(mongoose.Types.ObjectId(product._id)));
  //     }
  //     productIDs ={$in:relatedproductids}
  // }
  // if(productIds.length >= 2){
  //   productIDs = {$in:productIds}
  // }
  // const subscribeduser = await UserModel.aggregate([
  //   {
  //     $match: {
  //       subscribedAdvisories: productIDs, // Match with the required cupper ID
  //     },
  //   },
  //   {
  //     $unwind: "$customNotification", // Unwind the data array
  //   },
  //   {
  //     $match: {
  //       "customNotification.notificationTypeid": objecttypeID,
  //       "customNotification.status": true, // Match documents with data.status as true
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: null, // Group by the user _id
  //       userIds: { $addToSet: "$_id" },
  //     },
  //   },
  // ]);
  // console.log(subscribeduser)
  // console.log(subscribeduser[0]?.userIds.length);
  // const subcribedUserIDs = subscribeduser[0]?.userIds;
  // console.log(subcribedUserIDs)
  const comboProduct = await productModel.find({
    relatedProductsIds:{$in:productIds}
  })
  if (comboProduct.length) {
    comboProduct.forEach((product) => productIds.push(product._id.toString()));
  }
  // console.log(productIds)
  const subcribedUser = await productviseUserModel.find({productId:{$in:productIds}}) 
  const alluserid = [...new Set(subcribedUser.map((user)=>user.listofuserId.map((id)=>id?.id?.toString())).flat())]
  const subcribedUserIDs = [...new Set(alluserid)]
  await sendNotification(
    subcribedUserIDs,
    title,
    body,
    dataId, 
    url,
    notificationImage,
    undefined,
    next
  );
  // const batchSize = 50; // Number of users to process in each batch

  // for (let i = 0; i < subcribedUserIDs.length; i += batchSize) {
  //   const usersBatch = subcribedUserIDs.slice(i, i + batchSize);

  //   await sendNotifications(usersBatch, title, body, url, notificationImage);
  // }
  // await sendNotification(subScribedfilterUsersType, title, body, dataId,url,
  //   notificationImage, next);
  const notification = await NotificationModel.create({
    body,
    title,
    notificationType: typeOfNotification,
    adviceId: dataId,
    insturmentId,
    targetAudience,
  });
  const insertmanyDocument = subcribedUserIDs?.map((dataID) => ({
    notificationid: notification._id,
    readStatus: false,
    userId: dataID,
  }));
  await userNotificationModel.insertMany(insertmanyDocument);

  if(whatsapp){
    const allusermobile = [
      ...new Set(
        subcribedUser
          .map((user) =>
            user.listofuserId.map((id) => {
              return {
                number: id?.mobile,
                name: id?.name,
                id: id?.id?.toString(),
              };
            })
          )
          .flat()
      ),
    ];
    const response = await SendTemplateWhatsappMessage(allusermobile, whatsapp);
    // const insertManyWhatsapp = allusermobile.map((data) => {
    //   return {
    //     messagebody: `
    //      ${data.name?`${data?.name?.toLowerCase().split(" ").map(
    //         (word) => word.charAt(0)?.toUpperCase() + word?.slice(1)
    //       )
    //       .join(" ").split(' ')[0]}`:''},
    //       ${whatsapp?.action?whatsapp?.action:''} 
    //       ${whatsapp?.body?whatsapp?.body:''} 
    //       ${whatsapp?.lotsize?whatsapp?.lotsize:''}
    //       ${whatsapp?.date?whatsapp?.date:''}
    //       ${whatsapp?.cmp?whatsapp?.cmp:''} 
    //       ${whatsapp?.underlying?whatsapp?.underlying:''} 
    //       ${whatsapp?.expiry?whatsapp?.expiry:''} 
    //       ${whatsapp?.strike?whatsapp?.strike:''}
    //       ${whatsapp?.optiontype?whatsapp?.optiontype:''} 
    //       ${whatsapp?.entry?whatsapp?.entry:''} 
    //       ${whatsapp?.stoploss?whatsapp?.stoploss:''} 
    //       ${whatsapp?.target?whatsapp?.target:''} 
    //       ${whatsapp?.status?whatsapp?.status:''}
    //   `,
    //     usermobile: data.number,
    //     userId: data.id,
    //     adviceid: dataId,
    //     responses:response
    //   };
    // });
    // // console.log('response form notificaiton controller',response.map(a=>a.value.data))
    // await whatsappMsgModel.insertMany(insertManyWhatsapp);
  }
};

const Notify = async (req, res, next) => {
  const {
    title,
    body,
    userIds,
    productIds,
    everyone,
    targetaudience,
    typeOfNotification,
    url,
    notificationImage,
  } = req.body;
  const startTime = new Date();
  try {
    if (productIds.length > 0) {
      await NotifyProduct(
        productIds,
        title,
        body,
        undefined,
        undefined,
        undefined,
        targetaudience,
        typeOfNotification,
        undefined,
        url,
        notificationImage,
        next
      );
    }
    const endTime = new Date();
    const executionTime = endTime - startTime;
    console.log(`Execution time: ${executionTime} milliseconds`);
    res.status(200).send({
      success: true,
      message: "Notification sent out",
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const NotifyEveryone = async (req, res, next) => {
  const {
    title,
    body,
    userIds,
    productIds,
    everyone,
    typeOfNotification,
    url,
    notificationImage,
  } = req.body;
  try {
    if (everyone) {
      const startTime = new Date();
      const objecttypeID = mongoose.Types.ObjectId(typeOfNotification);
      const alluser = await UserModel.aggregate([
        {
          $unwind: "$customNotification", // Unwind the data array
        },
        {
          $match: {
            "customNotification.notificationTypeid": objecttypeID,
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
      // const batchSize = 50; // Number of users to process in each batch

      // for (let i = 0; i < AlluserID.length; i += batchSize) {
      //   const usersBatch = AlluserID.slice(i, i + batchSize);

      // }
      await sendNotification(
        AlluserID,
        title,
        body,
        undefined,
        url,
        notificationImage,
        undefined,
        next
      );

      const notification = await NotificationModel.create({
        body,
        title,
        notificationType: typeOfNotification,
        targetAudience: "Everyone",
      });
      const insertmanyDocument = AlluserID.map((dataID) => ({
        notificationid: notification._id,
        readStatus: false,
        userId: dataID,
      }));
      await userNotificationModel.insertMany(insertmanyDocument);
      // for (userID of AlluserID) {
      //   await userNotificationModel.create({
      //     notificationid: notification._id,
      //     readStatus: false,
      //     userId: userID,
      //   });
      // }
      const endTime = new Date();
      const executionTime = endTime - startTime;
      console.log(`Execution time: ${executionTime} milliseconds`);
      res.end(
        `Notifications process completed Send to ${AlluserID.length} users`
      );
    }
  } catch (error) {
    console.log(error);
    res.send(`${error}`);
  }
};

const getUserNotifications = async (req, res, next) => {
  let userId = req.body.subscribedUsers?req.body.subscribedUsers:res.locals.user._id;
  let skip = req.body.skip || 0;
  let limit = req.body.limit;
  let trades = req.body.trades ?? false;

  let notificationTypeIds = [];

  if (
    req.body.notificationTypes !== undefined ||
    req.body.notificationTypes !== null ||
    req.body.notificationTypes.length !== 0
  ) {
    req.body.notificationTypes?.forEach((element) => {
      console.log(element);
      notificationTypeIds.push(mongoose.Types.ObjectId(element));
    });
  }
  const pipeline = [];
  pipeline.push({ $sort: { createdAt: -1 } });
  pipeline.push({
    $match: {
      userId: mongoose.Types.ObjectId(userId),
    },
  });
  pipeline.push({
    $lookup: {
      from: "newnotifications",
      localField: "notificationid",
      foreignField: "_id",
      as: "notification",
    },
  });

  pipeline.push({
    $unwind: "$notification",
  });
  pipeline.push({
    $lookup: {
      from: "notificationstypes",
      localField: "notification.notificationType",
      foreignField: "_id",
      as: "notificationType",
    },
  });
  pipeline.push({
    $unwind: "$notificationType",
  });

  pipeline.push({
    $lookup: {
      from: "instruments",
      localField: "notification.insturmentId",
      foreignField: "_id",
      as: "insturmentDetails",
    },
  });

  // filtering notification based on notification types
  pipeline.push({
    $match:
      notificationTypeIds.length !== 0
        ? {
            "notificationType._id": {
              $in: notificationTypeIds,
            },
          }
        : {},
  });
  if (trades) {
    pipeline.push({
      $match: {
        "notification.adviceId": { $exists: true }, // checking notification had advice id or not
      },
    });
  } else {
    pipeline.push({
      $match: {
        "notification.adviceId": { $exists: false }, // checking notification had advice id or not
      },
    });
  }
  pipeline.push({
    $skip: skip, // skip notifications
  });
  pipeline.push({
    $limit: parseInt(limit), // notifications limit
  });

  // project fields
  pipeline.push({
    $project: {
      _id: 1,
      adviceId: "$notification.adviceId",
      body: "$notification.body",
      title: "$notification.title",
      notificationType: "$notificationType.typeofNotification",
      notificationLimit: "$notificationType.notificationLimit",
      insturmentName: { $arrayElemAt: ["$insturmentDetails.name", 0] },
      readStatus: 1,
      createdAt: 1,
    },
  });

  try {
    const result = await userNotification.aggregate(pipeline);
    return res.status(200).send({
      success: true,
      message: "Success",
      notifications: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};


// const getUserNotifications = async(req,res,next)=>{
//   let userId = req.body.subscribedUsers?req.body.subscribedUsers:res.locals.user._id;
//   let skip = req.body.skip || 0;
//   let limit = req.body.limit;
//   let trades = req.body.trades ?? false;
//   try {
//     //all user notification with advice and information
//     const usernotification = await userNotification.find({userId}).sort({createdAt:-1}).populate('notificationid')
//     const instrumentmodel = await instrument.find({})
//     const typeofNotification = await notificationTypeModel.find({})
//     let notificationTypeIds = [];
//       // if (
//       //   req.body.notificationTypes !== undefined ||
//       //   req.body.notificationTypes !== null ||
//       //   req.body.notificationTypes.length !== 0
//       // ) {
//       //   req.body.notificationTypes?.forEach((element) => {
//       //     notificationTypeIds.push(element);
//       //   });
//       // }
//     let tradesnotification 
//     let result
//     if(trades){
//       tradesnotification = usernotification.filter((adviceId)=>{
//         if(adviceId.notificationid.adviceId){
//           return true
//         }else return false 
//       }) 
//       if(notificationTypeIds.length >0){
//         tradesnotification = tradesnotification.filter((typeid)=>notificationTypeIds.includes(typeid.notificationid.notificationType.toString()))
//        }
//       const startIndex = skip;
//     const endIndex = skip + limit;
//      result = tradesnotification.map((notification)=>{
//       const notificationtype = typeofNotification.filter(id=>id?._id?.toString() === notification?.notificationid?.notificationType?.toString())
//       const instrumentname = instrumentmodel.filter(id=>id?._id?.toString() === notification.notificationid.insturmentId?.toString())
//       return { 
//         _id: notification._id,
//       adviceId: notification.notificationid.adviceId,
//       body:notification.notificationid.body,
//       title:notification.notificationid.title,
//       notificationType:notificationtype[0]?.typeofNotification,
//       notificationLimit:notificationtype[0]?.notificationLimit,
//       insturmentName: instrumentname[0]?.name,
//       readStatus: notification.readStatus,
//       createdAt:notification.notificationid.createdAt
//     }
//     }).slice(startIndex, endIndex);
//     }
//     if(!trades){
//       tradesnotification = usernotification.filter((adviceId)=>{
//         if(!adviceId.notificationid.adviceId){
//           return true
//         }else return false 
//       })
//       const startIndex = skip;
//     const endIndex = skip + limit;
//     if(notificationTypeIds.length >0){
//       tradesnotification = tradesnotification.filter((typeid)=>notificationTypeIds.includes(typeid?.notificationid?.notificationType?.toString()))
//      }
//     result = tradesnotification.map((notification)=>{
//       const notificationtype = typeofNotification.filter(id=>id?._id?.toString() === notification?.notificationid?.notificationType?.toString())
//      return { 
//       _id: notification._id,
//       body:notification.notificationid.body,
//       title:notification.notificationid.title,
//       notificationType:notificationtype[0]?.typeofNotification,
//       notificationLimit:notificationtype[0]?.notificationLimit,
//       insturmentName: notification.notificationid.name,
//       readStatus: notification.readStatus,
//       createdAt:notification.notificationid.createdAt
//     }
//     }).slice(startIndex, endIndex);
//     }
//     // console.log(tradesnotification.length)
//     res.status(200).send({
//       success:true,
//       message:'Success',
//       notifications:result
//     })
//   } catch (error) {
//     console.log(error)
//   }
// }

const updateUserNotificationStatus = async (req, res, next) => {
  const notificationId = req.params.notificationId;
  const updatedReadStatus = req.body.readStatus;
  const userId = res.locals.user._id;
  console.log(notificationId,updatedReadStatus,userId)
  try {
    const updatedNotification = await userNotification.findByIdAndUpdate(
      notificationId,
      { readStatus: updatedReadStatus },
      { new: true }
    );
    console.log(updatedNotification)
    const userNotifiCount = await userNotification.find({
      userId: userId,
      readStatus: false,
    });
    io.emit(
      userId.toString().replace(/objectId\("|"\)/g, ""),
      userNotifiCount.length
    );

    return res.status(200).json({
      success: true,
      message: "Read status updated successfully",
      data: updatedNotification,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateAll = async (req, res, next) => {
  let userId = res.locals.user._id;
  try {
    const updateAllNotifications = await userNotification.updateMany(
      {
        userId: userId,
        readStatus: false,
      },
      {
        $set: { readStatus: true },
      }
    );
    // const userNotifiCount = await userNotification.find({
    //   userId: userId,
    //   readStatus: false,
    // });
    io.emit(userId.toString().replace(/objectId\("|"\)/g, ""), 0);
    return res.status(200).json({
      success: true,
      message: "Read status updated successfully",
      data: updateAllNotifications,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getNotificationsCount = async (req, res, next) => {
  const userId = res.locals.user._id;
  try {
    const userNotifiCount = await userNotification.find({
      userId: userId,
      readStatus: false,
    });
    io.emit(
      userId.toString().replace(/objectId\("|"\)/g, ""),
      userNotifiCount.length
    );
    return res
      .status(200)
      .send({ success: true, message: "Read status updated successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getAllAdminnotification = async (req, res, next) => {
  try {
    const query = res.locals.query || {};
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = (req.query.search || "").replace(/\s+/g, "");

    const countQuery = search
      ? {
          $or: [
            { title: new RegExp(search, "i") },
            { body: new RegExp(search, "i") },
          ],
        }
      : {};

    const startTime = new Date();
    const count = await adminlistofNotificationModel.countDocuments(countQuery);
    const countmainCollection = await NotificationModel.countDocuments(
      countQuery
    );
    if (count !== countmainCollection) {
      await updateAdminlistNotificationData();
    }
    const sort = { _id: -1 };
    const options = {
      sort,
      skip: (page - 1) * limit,
      limit,
    };

    const findQuery = search
      ? {
          ...query,
          _id: {
            $in: (
              await adminlistofNotificationModel.find(countQuery, "_id").lean()
            ).map((access) => access._id),
          },
        }
      : query;
    const data = await adminlistofNotificationModel
      .find(findQuery, null, options)
      .lean();
    const endTime = new Date();
    const executionTime = endTime - startTime;
    console.log(`Execution time: ${executionTime} milliseconds`);
    const totalPages = Math.ceil(count / limit);

    const result = {
      page,
      size: data.length,
      total: count,
      pageTotal: totalPages,
      items: data,
    };

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const updateAdminlistNotificationData = async () => {
  try {
    const data = await NotificationModel.find()
      .populate("notificationType")
      .lean();
    const dataIds = data.map((notification) => notification._id.toString());
    const adminlistdata = await adminlistofNotificationModel.find();
    const adminlistdataids = adminlistdata.map((notification) =>
      notification._id.toString()
    );
    const concatdata = dataIds.concat(adminlistdataids);
    const uniqueIds = concatdata.filter((value, index, self) => {
      return self.indexOf(value) === self.lastIndexOf(value);
    });
    const uniqueObjectIDObjects = Array.from(uniqueIds).map(
      (id) => new ObjectId(id)
    );
    const notificationdata = await NotificationModel.find({
      _id: { $in: uniqueObjectIDObjects },
    })
      .populate("notificationType")
      .lean();
    const userQuery = { notificationid: { $in: uniqueObjectIDObjects } };
    const userNotifications = await userNotification
      .find(userQuery)
      .populate("userId")
      .lean();
    const userMap = userNotifications.reduce((acc, user) => {
      const userId = user.notificationid.toString();
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push({
        name: user.userId?.name,
        email: user.userId?.email,
        _id: user.userId?._id,
      });
      return acc;
    }, {});
    const augmentedData = notificationdata.map((notification) => ({
      ...notification,
      notificationType: notification?.notificationType?.typeofNotification,
      userDetails: userMap[notification._id.toString()] || [],
    }));
    const startTime = new Date();
    const insertManyNotification =
      await adminlistofNotificationModel.insertMany(augmentedData);
    const endTime = new Date();
    const executionTime = endTime - startTime;
    console.log(`Execution time: ${executionTime} milliseconds`);
    return insertManyNotification;
  } catch (error) {}
};
const adminlistdatamigration = async (req, res, next) => {
  try {
    const response = await updateAdminlistNotificationData();
    res.status(200).send({ response });
  } catch (error) {
    console.log(error);
  }
};
const getAdviceNotifications = async (req, res, next) => {
  const { adviceId } = req.body;
  try {
    const notifications = await NotificationModel.find({
      adviceId: adviceId,
    })
      .populate("notificationType")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      count: notifications.length,
      message: "Success",
      notifications: notifications,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = {
  Notify,
  NotifyEveryone,
  NotifyProduct,
  getUserNotifications,
  updateUserNotificationStatus,
  getNotificationsCount,
  getAllAdminnotification,
  updateAll,
  adminlistdatamigration,
  getAdviceNotifications,
};
