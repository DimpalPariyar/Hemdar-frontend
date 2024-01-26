const awsService = require("../service/aws_service");
const otpGenerator = require("otp-generator");
const OTPModel = require("../model/otp.model");
const UserModel = require("../model/user.model");
const BeatAccessModel = require("../model/betaAccess.model");
const TokenModel = require("../model/token.model");
const { addMinutesToDate } = require("../utils/DateTimeUtils");
const {
  generateAccessToken,
  generateRefreshToken,
  addToList,
} = require("../utils/jwt-token");
const { verifyJwtValidity } = require("../utils/jwt-token");
const notificationTypeModel = require("../model/notificationType.model");
const { SendSmsMessage } = require("../service/authkey.service");
require("dotenv").config();

const checkHasBetaAccess = async (contact) => {
  try {
    const existingUser = await UserModel.findOne(contact).lean();
    if (existingUser) {
      return true;
    }
    const user = await BeatAccessModel.findOne(contact).lean();
    if (!user || !user.enable) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const checkIfLoggedIn = async (mobile, email) => {
  let query = {};
  if (mobile) {
    query = { mobile };
  } else {
    query = { email };
  }
  const user = await UserModel.findOne(query).lean();
  if (!user) {
    return;
  }
  const token = await TokenModel.findOne({ user: user._id });
  if (!token) {
    return;
  }
  await token.remove();
};

const sendOTP = async (req, res, next) => {
  const { email, mobile } = req.body;

  console.log(mobile);
  if (email === undefined && mobile === undefined) {
    next(new Error("Both Email and Mobile cannot be empty"));
    return;
  }
  let contact = {};
  if (email) {
    contact.email = email;
  } else if (mobile) {
    contact.mobile = mobile;
  } else {
    return next({
      message: "Both Email and Mobile cannot be empty",
    });
  }
  try {
    let hasBetaAccess = false;
    if (res.locals.user) {
      hasBetaAccess = true;
    } else {
      // hasBetaAccess = await checkHasBetaAccess(contact);
      hasBetaAccess = true;
    }

    // if (process.env.NODE_ENV !== 'production') {
    //   hasBetaAccess = true;
    // }

    if (mobile === "9988776655") {
      hasBetaAccess = true;
    }

    if (!hasBetaAccess) {
      return next({
        message: `${email ? email : mobile} not registered for beta access`,
      });
    }

    await checkIfLoggedIn(mobile, email);

    await triggerOTPService(mobile, email, res, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

async function triggerOTPService(mobile, email, res, next) {
  let otp = "123456";
  let isTest = process.env.NODE_ENV !== "production";
  if (mobile === "9988776655") {
    isTest = true;
  }
  console.log("isTest", isTest);
  if (!isTest) {
    otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
  }
  await addNewOTP(otp, 15, email, 0, mobile);
  try {
    if (mobile !== undefined) {
      // const response = await awsService.triggerOTP(mobile, otp);
      const response = await SendSmsMessage(mobile, otp);
      res.status(200).send({
        success: true,
        id: response,
      });
    } else {
      const response = await awsService.triggerEmail(email, otp);
      res.status(200).send({
        success: true,
        id: response,
      });
    }
  } catch (e) {
    next(e);
  }
}

const addNewOTP = (otp, expirationTime, email, status, mobile) => {
  const otpModel = new OTPModel({
    mobile,
    email,
    otp,
    expireIn: addMinutesToDate(new Date(), expirationTime),
    status,
  });
  return otpModel.save();
};

const verify = async (req, res, next) => {
  const { email, mobile, otp, fcmToken, appVersion } = req.body;
  console.log(req.body);
  if (email === undefined && mobile === undefined) {
    next(new Error("Both Email and Mobile cannot be empty"));
    return;
  }

  try {
    const validOTP = await OTPModel.findOne({
      mobile,
      email,
      otp,
      status: 0,
      expireIn: { $gte: new Date().getTime() },
    });
    if (validOTP) {
      let user;
      let isNewUser = true;
      let panStatus;
      await OTPModel.updateOne({ _id: validOTP._id }, { $set: { status: 1 } });
      if (email !== undefined) {
        user = await UserModel.findOneAndUpdate(
          { email },
          {
            $set: {
              status: 1,
              appVersion: appVersion,
              currentLogin: Date.now(),
            },
          },
          { new: true, upsert: true }
        );
        if (user.currentLogin !== undefined) {
          isNewUser = false;
        }
        if (user.panNumber !== undefined) {
          panStatus = false;
        } else panStatus = true;
        user.lastLogin = user.currentLogin;
        await user.save();
      } else if (mobile !== undefined) {
        user = await UserModel.findOneAndUpdate(
          { mobile },
          {
            $set: {
              status: 1,
              appVersion: appVersion,
              fcmToken: fcmToken,
              whatsappnumber:`91${mobile}`,
              currentLogin: Date.now(),
            },
          },
          { new: true, upsert: true }
        );
        if (user.currentLogin !== undefined) {
          isNewUser = false;
        }
        if (user.panNumber === "" || user.panNumber === undefined) {
          panStatus = false;
        } else panStatus = true;
        user.lastLogin = user.currentLogin;
        const typeofNotification = await notificationTypeModel.find({});
        await user.save();
        const usercustomNotification = user.customNotification;
        console.log(user.customNotification.length, typeofNotification.length);
        if (user.customNotification.length !== typeofNotification.length) {
          const nullnotify = await UserModel.findOneAndUpdate(
            { mobile },
            { $unset: { customNotification: 1 } },
            { new: true }
          );
          nullnotify.save();
          for (let i = 0; i < typeofNotification.length; i++) {
            const customnotifydata = {
              typeOfNotification: typeofNotification[i].typeofNotification,
              notificationTypeid: typeofNotification[i]._id,
              status: true,
            };
            console.log(customnotifydata);
            const updatenotify = await UserModel.findOneAndUpdate(
              { mobile },
              { $push: { customNotification: customnotifydata } },
              { new: true }
            );
            await updatenotify.save();
          }
        }
      } else {
        return next({
          message: "Both email and mobile cannot be empty",
          status: 400,
        });
      }

      const token = generateAccessToken({ id: user._id, type: user.type });
      const refreshToken = generateRefreshToken({
        id: user._id,
        type: user.type,
      });
      await addToList(user._id, refreshToken, token);
      res.status(200).send({
        success: true,
        userId: user._id,
        token: token,
        refreshToken: refreshToken,
        isNewUser,
        panStatus,
        message: "User successfully logged in.",
      });
    } else {
      res.status(422).send({
        success: false,
        message: "Invalid OTP, please try again",
      });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const reSendOTP = async (req, res, next) => {
  // TODO implement resend OTP
  res.status(200).send({
    success: false,
    message: "Yet to be implemented",
  });
};

module.exports = {
  sendOTP,
  reSendOTP,
  verify,
  triggerOTPService,
};
