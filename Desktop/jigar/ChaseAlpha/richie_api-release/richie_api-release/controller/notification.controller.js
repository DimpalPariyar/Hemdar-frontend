const UserModel = require("../model/user.model");
const NotificationModel = require("../model/notification.model");
const { sendNotification } = require("../service/one_signal");
const _ = require("lodash");
const notificationTypeModel = require("../model/notificationType.model");
const { mongoose } = require("mongoose");
// const { emitDataToSocket } = require('../service/socket_io_service');

const notifyProduct = async (
  productIds,
  title,
  body,
  unSubTitle,
  unSubBody,
  dataId,
  targetAudience,
  typeOfNotification,
  insturmentName,
  url,
  notificationImage,
  next
) => {
  let subscribedUsers = await UserModel.find({
    subscribedAdvisories: { $in: productIds },
  });
  if (targetAudience === "Everyone") {
    subscribedUsers = await UserModel.find();
  }
  // const subscribedUserIds = _.map(subscribedUsers, (user) => {return {_id:user._id,name:user.name,email:user.email}});
  // const notifySubscribedUserIds = _.map(subscribedUsers,(user)=> user._id)
  const objecttypeID = mongoose.Types.ObjectId(typeOfNotification);
  const subScribedfilteredType = subscribedUsers.filter((user) => {
    const status = user.customNotification.filter((type) => {
      return objecttypeID.equals(type.notificationTypeid);
    });
    return status[0]?.status === true;
  });
  const subscribedUserIds = _.map(subScribedfilteredType, (user) => {
    return { _id: user._id, name: user.name, email: user.email };
  });
  const subScribedfilterUsersType = _.map(
    subScribedfilteredType,
    (user) => user._id
  );
  // await sendNotification(subScribedfilterUsersType, title, body, dataId,url,
  //   notificationImage, next);

  await NotificationModel.create({
    notificationBody: body,
    notificationTitle: title,
    unSubNotificationBody: unSubBody,
    unSubNotificationTitle: unSubTitle,
    subscribedUsers: subscribedUserIds,
    targetAudience,
    userDetails: subscribedUserIds,
    typeOfNotification,
    adviceId: dataId,
    insturmentName,
  });
  const nonSubscribedUsers = await UserModel.find({
    subscribedAdvisories: { $nin: productIds },
  });

  if (unSubTitle && unSubBody) {
    const nonSubscribedUserIds = _.map(nonSubscribedUsers, (user) => user._id);
    await sendNotification(
      nonSubscribedUserIds,
      unSubTitle,
      unSubBody,
      dataId,
      url,
      notificationImage,
      undefined,
      next
    );
  }
};

const notify = async (req, res, next) => {
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
  console.log(everyone, productIds);
  const startTime = new Date();
  try {
    if (everyone) {
      const userDocs = await UserModel.find();
      const userIds = _.map(userDocs, (userDoc) => userDoc._id);
      // await sendNotification(userIds, title, body, undefined, next);
      let targetAudience = "Everyone";
      await notifyProduct(
        undefined,
        title,
        body,
        undefined,
        undefined,
        undefined,
        targetAudience,
        typeOfNotification,
        undefined,
        url,
        notificationImage,
        next
      );
    } else if (userIds && userIds.length > 0) {
      await sendNotification(userIds, title, body, undefined, next);
    } else if (productIds.length > 0) {
      await notifyProduct(
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

const getAllnotification = async (req, res, next) => {
  let query = res.locals.query || {};
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const removedSpaceSearch = req.query.search;
  const search = removedSpaceSearch?.split(" ").join("");
  console.log(req.query);
  try {
    const count = await NotificationModel.countDocuments(query);
    if (search) {
      const regex = new RegExp(search, "i");
      const filter = {
        $or: [{ notificationTitle: regex }, { notificationBody: regex }],
      };
      const accessIds = await NotificationModel.find(filter, "_id");
      query._id = { $in: accessIds.map((access) => access._id) };
    }
    const sort = { _id: -1 };
    const options = { sort };
    if (!isNaN(page) && !isNaN(limit)) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }
    const data = await NotificationModel.find(query)
      .populate("typeOfNotification")
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip)
      .lean();

    const totalPages = Math.ceil(count / limit);
    const result = {
      page: page,
      size: data.length,
      total: count,
      pageTotal: totalPages,
      items: _.map(data),
    };
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllTypeofNotification = async (req, res, next) => {
  try {
    const result = await notificationTypeModel.find();

    if (!result) {
      res.status(400).send({ message: "Notification type is empty" });
    }
    res.status(200).send(result);
  } catch (error) {}
};
const createNotificaitonType = async (req, res, next) => {
  const notificationtype = req.body;
  try {
    if (!req.body.typeofNotification) {
      res.status(400).send({ message: "typeofNotification field is missing" });
    }
    if (!req.body.notificationDescription) {
      res
        .status(400)
        .send({ message: "notificaitonDescription field is missing" });
    }
    const data = await notificationTypeModel.create(notificationtype);
    const notificationdata = {
      notificationTypeid: data._id,
      typeOfNotification: data.typeofNotification,
      status: true,
    };
    await UserModel.updateMany(
      {},
      {
        $push: { customNotification: notificationdata },
      }
    );

    res.status(200).send(data);
  } catch (error) {}
};

const getUserAllNotifications = async (req, res, next) => {
  const page = parseInt(req.body.page);
  const limit = parseInt(req.body.limit);
  const userId =
    req.body.userId === undefined
      ? undefined
      : mongoose.Types.ObjectId(req.body.userId);
  const adviceId =
    req.body.adviceId === undefined
      ? undefined
      : mongoose.Types.ObjectId(req.body.adviceId);
  console.log(`adviceId is ${adviceId}`);
  var filters = [];
  if (req.body.filters !== undefined && req.body.filters !== null) {
    req.body.filters.map((id) => filters.push(mongoose.Types.ObjectId(id)));
  }

  var query = {};
  query.subscribedUsers = [];
  if (userId !== null && userId !== undefined) {
    console.log(userId);
    query.subscribedUsers = {
      $elemMatch: {
        _id: userId,
      },
    };
  }

  if (filters.length > 0) {
    query.typeOfNotification = { $in: filters };
  }

  try {
    if (
      page === null ||
      page === undefined ||
      limit === null ||
      limit === undefined
    ) {
      const result = await NotificationModel.find(query)
        .populate("typeOfNotification")
        .sort({ _id: -1 });
      console.log(result.length);
      return res
        .status(200)
        .send({ success: true, message: "Success", notifications: result });
    } else {
      console.log(`checking ---.........  ${query.subscribedUsers}`);
      const result = await NotificationModel.find(query)
        .populate("typeOfNotification")
        .sort({ _id: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      console.log(result.length);
      return res
        .status(200)
        .send({ success: true, message: "Success", notifications: result });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const DeleteTypeofNotification = async (req, res, next) => {
  console.log(req.params.id);
  try {
    const record = await notificationTypeModel.findOneAndRemove({
      _id: req.params.id,
    });
    const deletetypeofnotification = await UserModel.updateMany(
      {},
      {
        $pull: { customNotification: { notificationTypeid: req.params.id } },
      }
    );
    if (!record) {
      return res
        .status(404)
        .json({ message: "Type of Notification not found" });
    }
    return res.json({ message: "Type of Notification deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const UpdateReadStatus = async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.params.id);
  const notificationId = req.body.notificationId;
  const status = req.body.status;

  try {
    const Notification = await NotificationModel.findById(notificationId);
    if (!Notification) {
      res.status(401).send({
        message: "Notification Not Found",
      });
    }
    Notification.subscribedUsers.filter((id) => {
      if (userId.equals(id?._id)) {
        id.readStatus = status;
      }
    });
    console.log(Notification, userId);
    await Notification.save();
    // const allnotification = await NotificationModel.find({subscribedUsers:{$elemMatch:{_id:userId,readStatus:false}}})
    // const data = {
    //   userId,
    //   Count:allnotification.length
    // }
    // emitDataToSocket('count',data)
    res.status(200).send({
      message: "successfully updated the status",
      notiification: Notification,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Error" });
  }
};

const getUnreadNotificationCount = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id);
    const allnotification = await NotificationModel.find({
      subscribedUsers: { $elemMatch: { _id: userId, readStatus: false } },
    });
    console.log(allnotification[0].subscribedUsers);
    // emitDataToSocket("count",allnotification.length)
    res.status(200).send({ count: allnotification.length });
  } catch (error) {}
};

const updateNotificationModel = async (req, res, next) => {
  try {
    // const allnotification = await NotificationModel.find()

    const udpatedata = await NotificationModel.aggregate([
      {
        $project: {
          subscribedUsers: {
            $map: {
              input: "$subscribedUsers",
              as: "objectId",
              in: {
                _id: "$$objectId", // Convert the string ObjectID to ObjectId
                readStatus: false, // Set the default value of "readstatus" to false
              },
            },
          },
        },
      },
    ]);
    for (let i = 0; i < udpatedata.length; i++) {
      await NotificationModel.findByIdAndUpdate(udpatedata[i]._id, {
        subscribedUsers: udpatedata[i].subscribedUsers,
      });
    }
    return res
      .status(200)
      .json({ message: "subscribedUsers array updated successfully." });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  notify,
  notifyProduct,
  getAllnotification,
  getAllTypeofNotification,
  createNotificaitonType,
  getUserAllNotifications,
  UpdateReadStatus,
  DeleteTypeofNotification,
  getUnreadNotificationCount,
  updateNotificationModel,
};
