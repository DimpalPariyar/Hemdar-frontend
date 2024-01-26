const SuperCourseModel = require('../model/superCourse.model');
const courseType = require('../constants/courseType');
const ProgramSessionModel = require('../model/programSession.model');
const BillingModel = require('../model/billing.model');
const { validationResult } = require('express-validator');
const OrderModel = require('../model/order.model');
const UserModel = require('../model/user.model');
const mongoose = require('mongoose');
const { createRazorPayOrder } = require('../service/razorpay_service');
const { SessionPlans } = require('../model/price.model');
const _ = require('lodash');
const moment = require('moment-timezone');
// const InvoiceCounter = require('../model/invoiceCounter.model')
// const { triggerInvoice } = require('../service/easy_invoice');
// const { uploadToS3 } = require('./upload.controller');


const videoType = {
  0: 'live',
  1: 'recorded',
};

const searchApiResult = async (req, res, next) => {
  try {
    let allLearnerItems = [];
    const allSuperCourses = await SuperCourseModel.find({
      supercourseType: { $ne: courseType.subCourse },
    })
      .populate('languageDetails', '-_id -courseIds -webinarIds')
      .populate('levelDetails', '-_id -courseIds -webinarIds')
      .populate('hostDetails', '-_id -type -registerNumber -licenseNumber')
      .select('-_id ')
      .lean();

    if (allSuperCourses) {
      let cleaned = allSuperCourses.map(
        ({
          levelIds,
          languageIds,
          hostIds,
          linkIds,
          parentCourseIds,
          qaIds,
          testimonialIds,
          childCourseIds,
          disclaimerLabel,
          disclaimerDescription,
          ...rest
        }) => {
          rest.videoType = videoType[rest?.videoType];
          rest.supercourseType = courseType[rest.supercourseType];
          return rest;
        }
      );
      allLearnerItems = allLearnerItems.concat(cleaned);
    }

    const allSessions = await ProgramSessionModel.find()
      .select('-_id -id')
      .lean();

    if (allSessions) {
      allLearnerItems = allLearnerItems.concat(allSessions);
    }
    return res.status(200).json({ success: true, data: allLearnerItems });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const upvoteSuperCourse = async (req, res, next) => {
  try {
    const superCourseId = req.params.superCourseId;
    const userId = res.locals.user._id;

    const isUserUpVoted = await SuperCourseModel.exists({
      $and: [
        { superCourseId: superCourseId },
        { upVotedUserIds: { $in: [userId] } },
      ],
    });

    if (isUserUpVoted) {
      SuperCourseModel.updateOne(
        { superCourseId: superCourseId },
        {
          $pull: {
            upVotedUserIds: userId,
          },
        },
        function (err) {
          if (err) {
            return res.status(422).json({
              message: err.message,
            });
          }
          return res.status(201).json({
            success: true,
            message: 'Upvote is removed from superCourse sucessfully',
          });
        }
      );
    } else {
      SuperCourseModel.updateOne(
        { superCourseId: superCourseId },
        {
          $push: {
            upVotedUserIds: userId,
          },
        },
        function (err) {
          if (err) {
            return res.status(422).json({
              message: err.message,
            });
          }
          return res.status(201).json({
            success: true,
            message: 'superCourse is upvoted sucessfully',
          });
        }
      );
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
};

async function validateUnBoughtSessions(userId, sessionIds) {
  const document = await UserModel.findById(userId, { purchasedSessions: 1 });
  return sessionIds.every(
    (id) =>
      !_.map(document.purchasedSessions, '_id')
        .map((ObjectId) => ObjectId.toString())
        .includes(id)
  );
}

async function validateBoughtSessions(userId, sessionIds) {
  const document = await UserModel.findById(userId, { purchasedSessions: 1 });
  return sessionIds.every((id) =>
    _.map(document.purchasedSessions, '_id')
      .map((ObjectId) => ObjectId.toString())
      .includes(id)
  );
}

async function replaceSessions(userId, sessionIds, newSessionIds) {
  try {
    await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $pull: { purchasedSessions: { $in: sessionIds } },
      }
    );
    await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $push: { purchasedSessions: { $each: newSessionIds } },
      }
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

const assignSessions = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  const { newSessionIds } = req.body;
  const userId = res.locals.user._id;
  const allNotPurchased = await validateUnBoughtSessions(userId, newSessionIds);
  const user = await UserModel.findOne(
    { _id: userId },
    'availableSessionTokens -purchasedSessions -subscribedAdvisories -activeSubscriptions'
  );
  if (user.availableSessionTokens >= newSessionIds.length && allNotPurchased) {
    const result = await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $push: { purchasedSessions: { $each: newSessionIds } },
        $inc: { availableSessionTokens: -newSessionIds.length },
      }
    );
    if (result.modifiedCount > 0) {
      return res.status(200).json({
        success: true,
        message: result.modifiedCount + ' Sessions assigned',
      });
    } else {
      return next('Something went wrong');
    }
  } else {
    if (!allNotPurchased) {
      return res.status(400).json({
        success: false,
        message:
          'All the newSessions should not to be purchased by the user to reschedule',
      });
    } else if (!(user.availableSessionTokens >= newSessionIds.length)) {
      return res.status(400).json({
        success: false,
        message: 'Not enough tokens to reschedule',
      });
    }
  }
};

const cancelSessions = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  const { sessionIds } = req.body;
  const userId = res.locals.user._id;
  const allPurchased = await validateBoughtSessions(userId, sessionIds);
  if (allPurchased) {
    const result = await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $pull: { purchasedSessions: { $in: sessionIds } },
        $inc: { availableSessionTokens: sessionIds.length },
      }
    );
    if (result.modifiedCount > 0) {
      return res.status(200).json({
        success: true,
        message:
          sessionIds.length + ' Sessions cancelled for later rescheduling',
      });
    } else {
      return next('Something went wrong');
    }
  } else {
    return res.status(400).json({
      success: false,
      message: 'All the sessions has to be purchased by the user to reschedule',
    });
  }
};

const swapSessions = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  const { sessionIds, newSessionIds } = req.body;
  const userId = res.locals.user._id;
  const allPurchased = await validateBoughtSessions(userId, sessionIds);
  const allNotPurchased = await validateUnBoughtSessions(userId, newSessionIds);
  if (allPurchased && allNotPurchased) {
    const success = replaceSessions(userId, sessionIds, newSessionIds);
    if (success) {
      return res.status(200).json({
        success: true,
        message: 'Sessions successfully rescheduled',
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Failed to reschedule sessions',
      });
    }
  } else {
    if (!allPurchased) {
      return res.status(400).json({
        success: false,
        message:
          'All the sessions has to be purchased by the user to reschedule',
      });
    } else if (!allNotPurchased) {
      return res.status(400).json({
        success: false,
        message:
          'All the newSessions should not to be purchased by the user to reschedule',
      });
    } else {
      return res.status(400).json({
        success: false,
        message:
          'All the sessions has to be purchased by the user and all the new sessions should have not been purchased by the user',
      });
    }
  }
};

const createBilling = async (billingDetails) => {
  try {
    const billing = await BillingModel.create(billingDetails);
    return billing._id;
  } catch (error) {
    console.log(error);
    throw new Error('Could not create billing details');
  }
};

const sessionSelection = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  try {
    const { sessionIds, billingDetails } = req.body;
    const userId = res.locals.user._id;
    const discountTobeApplied = await findDiscount(sessionIds.length);
    const totalPrice = await calculatePrice(sessionIds);
    const price = totalPrice - totalPrice * (discountTobeApplied / 100);
    const orderId = new mongoose.Types.ObjectId();
    const orderDetails = {
      amount: price * 100,
      id: orderId,
      userId: userId,
      type: 'Special program',
      productIds: sessionIds,
    };
    const razorPayResponse = await createRazorPayOrder(orderDetails);
    if (!razorPayResponse.id) {
      return next(razorPayResponse);
    }
    // create an order
    const billingId = await createBilling(billingDetails);
    const createOrder = new OrderModel({
      _id: orderId,
      programSessions: sessionIds,
      userId: userId,
      totalAmount: price * 100,
      billingId,
      superCourseId: [],
      gst:billingDetails.gstNumber,
      razorPayOrderId: razorPayResponse.id,
      amount: razorPayResponse.amount,
      amount_paid: razorPayResponse.amount_paid,
      amount_due: razorPayResponse.amount_due,
      currency: razorPayResponse.currency,
      notes: razorPayResponse.notes,
      receipt: razorPayResponse.receipt,
      status: razorPayResponse.status,
      attempts: razorPayResponse.attempts,
      created_at: razorPayResponse.created_at
        ? new Date(razorPayResponse.created_at * 1000)
        : null,
    });

    createOrder.save(function (err) {
      if (err) {
        console.log(err);
        return next(err);
      }
       return res.status(200).json({
        success: true,
        message: 'Order is created successfully',
        amountToBePaid: createOrder.totalAmount,
        orderId: createOrder._id,
        razorPayOrderId: createOrder.razorPayOrderId,
      });
    });
    //   let customer = {
    //   name: res.locals.user.name,
    //   city: '',
    //   zip: '',
    //   address: !res.locals.user.address ? '' : res.locals.user.address,
    //   mobile: res.locals.user.mobile,
    //   email: res.locals.user.email,
    //   gst: createOrder.gst ? createOrder.gst : '',
    //   address: !res.locals.user.address ? "": res.locals.user.address,
    //   mobile:res.locals.user.mobile,
    //   email:res.locals.user.email,
    //   gst:createOrder.gst ? createOrder.gst : '',
    // };
    // let productList =[]
    // if (createOrder.programSessions && createOrder.programSessions.length > 0) {
    //   const perSession = createOrder.listAmount / createOrder.programSessions.length;
    //   const programSessions = _.map(createOrder.programSessions, (session) => {
    //     return {
    //       qty: 1,
    //       title: session.sessionName,
    //       amount: perSession / 100,
    //     };
    //   });
    //   productList.push(...programSessions);
    // }
    
  //    InvoiceCounter.findOneAndUpdate(
  //     {id:"auto"},
  //     {"$inc":{"sequence":1}},
  //     {new:true},async(err,cd)=>{
  //       let counter
  //           if(cd === null){
  //             const newValue = new InvoiceCounter({invoiceid:"auto",sequence:1})
  //              newValue.save()
  //              counter = 1
  //           }else{
  //             counter = cd.sequence
  //           }
  //          function InvoiceNumber() {
  //             let date = moment(createOrder.created_at).format("l");
  //             const [day,month,year] = date.split("/")
  //             const paddedDay = day.padStart(2,"0")
  //           return `${paddedDay}${month}0${counter}${year}`;
  //      }
  //   const invoiceOrder = {
  //     number: InvoiceNumber(),
  //     date: moment(createOrder.created_at).format('ll'),
  //   };
  //   const data = await triggerInvoice(customer, productList, invoiceOrder);
  //   const fileName =
  //     moment(createOrder.created_at).format() + '_' + invoiceOrder.number + '.pdf';
  //   const buf = Buffer.from(data.pdf, 'base64');
  //   const s3Data = await uploadToS3(fileName, buf, 'application/pdf', next);
  //   createOrder.invoiceUrl = s3Data.Location;
  //   const order = OrderModel.findById(createOrder.id)
  //    order.invoiceUrl = s3Data.Location
  //    order.save(function (err) {
  //     if (err) {
  //       console.log(err);
  //       return next(err);
  //     }
  //   });
  //  if(err){
  //   console.log(err);
  //   res.status(400).send({message:'invoiceCounter not found'})
  //  }
  // })
  
  
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

async function findDiscount(numberOfSession) {
  const query = { numOfSessions: { $lte: numberOfSession } };
  const options = { sort: { numOfSessions: -1 } };
  const plan = await SessionPlans.findOne(query, null, options);
  if (plan != null) {
    return plan.discountPercentage;
  } else {
    return 0;
  }
}

async function calculatePrice(sessionIds) {
  const ids = _.map(sessionIds, (id) => new mongoose.Types.ObjectId(id));
  const results = await ProgramSessionModel.aggregate([
    {
      $match: {
        _id: { $in: ids },
      },
    },
    {
      $group: {
        _id: null,
        totalPrice: { $sum: '$basePricePerSession' },
      },
    },
  ]);
  return results[0].totalPrice;
}

const getAllPurchasedSuperCourses = async (req, res, next) => {
  try {
    const purchasedCourses = res.locals.user.purchasedCourses;
    if (purchasedCourses) {
      SuperCourseModel.find({ superCourseId: { $in: purchasedCourses } })
        .populate('languageDetails', '-_id -courseIds -webinarIds')
        .populate('levelDetails', '-_id -courseIds -webinarIds')
        .populate('hostDetails', '-_id')
        .populate('linksList', '-_id -__v')
        .select('-_id ')
        .lean()
        .exec(function (err, courses) {
          if (err) return next(err);
          if (courses) {
            let cleanedCourses = courses.map(
              ({
                levelIds,
                languageIds,
                hostIds,
                priceIds,
                linkIds,
                upVotedUserIds,
                ...rest
              }) => {
                rest.videoType = 'Recorded';
                rest.supercourseType = courseType[rest.supercourseType];
                rest.upvotes = upVotedUserIds.length;
                return rest;
              }
            );
            return res
              .status(200)
              .json({ success: true, data: cleanedCourses });
          } else {
            return res.status(200).json({ success: true, data: courses });
          }
        });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const getAllPurchasedSessions = async (req, res, next) => {
  const IST = 'Asia/Kolkata';
  const now = moment.tz(new Date(), IST).startOf('day');
  const currentUTCTime = now.clone().tz('UTC').toDate();
  try {
    const purchasedSessions = res.locals.user.purchasedSessions;
    ProgramSessionModel.find({
      $and: [
        { _id: { $in: purchasedSessions } },
        { date: { $gte: currentUTCTime } },
      ],
    })
      .populate('hostDetails', '-type -licenseNumber -registerNumber')
      .lean()
      .sort({ date: 1 })
      .exec(function (err, sessions) {
        if (err) return next(err);
        return res.status(200).json({ success: true, data: sessions });
      });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const getUserSessions = async(req,res,next)=>{
         const userID = res.locals.user._id
         console.log(userID)
         try {
             const user = await UserModel.findOne({_id:userID})
             const SessionId = user.purchasedSessions.sort()
             if(SessionId.length >0){
               res.status(200).send({
                data:SessionId
               }) 
             }else{
              res.status(400).send({
                message:'No session found for this user'
              })
             }

         } catch (error) {
          console.log(error)
         }
}

module.exports = {
  searchApiResult,
  upvoteSuperCourse,
  sessionSelection,
  getUserSessions,
  getAllPurchasedSuperCourses,
  getAllPurchasedSessions,
  swapSessions,
  cancelSessions,
  assignSessions,
};
