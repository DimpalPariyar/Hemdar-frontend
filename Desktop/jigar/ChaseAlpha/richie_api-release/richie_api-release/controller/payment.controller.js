const OrderModel = require('../model/order.model');
const SubscriptionOrderModel = require('../model/subscriptionOrder.model');
const InvoiceCounter = require('../model/invoiceCounter.model')
const crypto = require('crypto');
const UserModel = require('../model/user.model');
const {
  updateOrderOnDb,
  updateSubscriptionOrderOnDb,
  updateSubsOnDb,
  updateOrderAndPayment,
  updateFailedOrderAndPayment,
  updateFailedOrderOnDb,
} = require('../utils/razorpayMap');
const { triggerInvoice } = require('../service/easy_invoice');
const { triggerEmailInvoice } = require('../service/aws_service');
const { uploadToS3 } = require('./upload.controller');
const { validationResult } = require('express-validator');
const { nanoid } = require('nanoid');
const moment = require('moment');
const _ = require('lodash');
const { verifyWebhookSignature } = require('../service/razorpay_service');
require('dotenv').config();
// const logger = require('../utils/logger');
const { startSubscription } = require('./subscription.controller');
const { ResultWithContext } = require('express-validator/src/chain');
const couponModel = require('../model/coupon.model');
const { getCKYCdataAndStoreIndb } = require('../service/digio_service');
function expectedSignature(razorpay_order_id, razorpay_payment_id) {
  const key_secret = process.env.RAZORPAY_SECRET;
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  return crypto
    .createHmac('sha256', key_secret)
    .update(body.toString())
    .digest('hex');
}

async function addSessionToUser(razorPayOrderId, paymentPayload, orderPayload) {
  const order = await OrderModel.findOne({ razorPayOrderId: razorPayOrderId });

  const userId = order.userId;
  await UserModel.updateOne(
    { _id: userId },
    {
      $push: {
        purchasedSessions: order.programSessions,
        purchasedCourses: order.superCourseId,
        subscribedAdvisories: order.advisoryId,
        activeSubscriptions: order.subscriptionId,
      },
    }
  );
  if (paymentPayload && orderPayload) {
    const payments = {
      items: [paymentPayload],
    };
    return await updateOrderAndPayment(
      payments,
      orderPayload,
      order.gst,
      orderPayload.id,
      undefined,
      userId,
      undefined,
      undefined
    );
  } else {
    return await updateOrderOnDb(
      undefined,
      razorPayOrderId,
      userId,
      undefined,
      order.gst,
      undefined
    );
  }
}

async function updateFailedPaymentStatus(
  razorPayOrderId,
  paymentPayload,
  orderPayload
) {
  const order = await OrderModel.findOne({ razorPayOrderId: razorPayOrderId });

  const userId = order.userId;

  if (paymentPayload) {
    const payments = {
      items: [paymentPayload],
    };
    return await updateFailedOrderAndPayment(
      payments,
      orderPayload,
      order.gst,
      razorPayOrderId,
      undefined,
      userId,
      undefined,
      undefined
    );
  } else {
    return await updateFailedOrderOnDb(
      undefined,
      razorPayOrderId,
      userId,
      undefined,
      order.gst,
      undefined
    );
  }
}

async function addAdvisoryToUser(subscriptionOrderModel) {
  const userId = subscriptionOrderModel.userId;
  await UserModel.updateOne(
    { _id: userId },
    {
      $push: {
        subscribedAdvisories: subscriptionOrderModel.advisoryId,
        activeSubscriptions: subscriptionOrderModel._id,
      },
    }
  );
  return userId;
}

// const verifyAdvisory = async (req, res, next) => {
//   const { razorPayPaymentId, orderId, razorPaySignature } = req.body;
//   console.log('test........');
//   const subscriptionOrderModel = await SubscriptionOrderModel.findOne({
//     _id: orderId,
//   })
//     .lean()
//     .exec();
//   if (!subscriptionOrderModel) {
//     return next(new Error('Order missing'));
//   }
//   if (subscriptionOrderModel.status === 'active') {
//     return res.status(200).send({
//       success: true,
//       message: 'Signature verified via Webhook already, payment confirmed',
//       subscriptionOrderModel,
//     });
//   }
//   const exSignature = expectedSignature(
//     razorPayPaymentId,
//     subscriptionOrderModel.razorPaySubscriptionId
//   );
//   if (exSignature === razorPaySignature) {
//     try {
//       const userId = await addAdvisoryToUser(subscriptionOrderModel);
//       const data = await updateSubscriptionOrderOnDb(
//         subscriptionOrderModel._id,
//         subscriptionOrderModel.razorPaySubscriptionId,
//         subscriptionOrderModel.advisoryId,
//         userId,
//         subscriptionOrderModel.gst
//       );
//       res.status(200).send({
//         success: true,
//         message: 'Signature verified, payment confirmed',
//         data,
//       });
//     } catch (error) {
//       logger.log('error', 'razor pay verify advisory error', {
//         tags: 'razorpay',
//         additionalInfo: { errorMessage: error.message, error },
//       });
//       console.log(error);
//       return next(error);
//     }
//   } else {
//     logger.log('error', 'razor pay signature mismatched', {
//       tags: 'razorpay',
//     });
//     console.log(error);
//     return next(new Error('Signature mismatch'));
//   }
// };

const verifyAdvisory = async (req, res, next) => {
  const razorPayOrderId = req.body.razorPayOrderId;
  const razorPayPaymentId = req.body.razorPayPaymentId;
  const razorPaySignature = req.body.razorPaySignature;
  const order = await OrderModel.findOne({ razorPayOrderId: razorPayOrderId })
    .lean()
    .exec();
  if (order !== undefined && order.status === 'paid') {
    const invoiceUrl = await generateInvoice(order,next)
    const response = await getCKYCdataAndStoreIndb(order.userId?._id)
    console.log(response)
    return res.status(200).send({
      success: true,
      message: 'Signature verified via Webhook already, payment confirmed',
      data: order,
      invoiceUrl
    });
  }
  const exSignature = expectedSignature(razorPayOrderId, razorPayPaymentId);
  if (exSignature === razorPaySignature) {
    try {
      const data = await addSessionToUser(
        razorPayOrderId,
        undefined,
        undefined
      );
      await startSubscription(data._id);
      const invoiceUrl = await generateInvoice(order,next)
      const response = await getCKYCdataAndStoreIndb(order.userId?._id)
      console.log(response)
      if(!(order.CouponID === "No Coupon applied")){
         couponModel.findOneAndUpdate({_id:order.CouponID},{$push:{redeemUserId:user.locals.user.id}})
      }

      res.status(200).send({
        success: true,
        message: 'Signature verified, payment confirmed',
        data,
        invoiceUrl
      });
    } catch (error) {
      // logger.log('error', 'razor pay verify error', {
      //   tags: 'razorpay',
      //   additionalInfo: { errorMessage: error.message, error },
      // });
      console.log(error);
      return next(error);
    }
  } else {
    console.log(
      'Signature mismatch',
      'Razorpay : ' + razorPaySignature + ' Generated : ' + exSignature
    );
    return next(new Error('Signature mismatch'));
  }
};

const verify = async (req, res, next) => {
  const razorPayOrderId = req.body.razorPayOrderId;
  const razorPayPaymentId = req.body.razorPayPaymentId;
  const razorPaySignature = req.body.razorPaySignature;
  
  const order = await OrderModel.findOne({ razorPayOrderId: razorPayOrderId })
    .lean()
    .exec();
  if (order !== undefined && order?.status === 'paid') {
    const invoiceUrl = await generateInvoice(order,next)
    const response = await getCKYCdataAndStoreIndb(order.userId?._id)
    console.log(response)
    return res.status(200).send({
      success: true,
      message: 'Signature verified via Webhook already, payment confirmed',
      data: order,
      invoiceUrl
    });
  }
  const exSignature = expectedSignature(razorPayOrderId, razorPayPaymentId);
  if (exSignature === razorPaySignature) {
    try {
      const data = await addSessionToUser(
        razorPayOrderId,
        undefined,
        undefined
      );
      const updatedorder = await OrderModel.findOne({ razorPayOrderId: razorPayOrderId })
      const invoiceUrl = await generateInvoice(updatedorder,next)
      const response = await getCKYCdataAndStoreIndb(order.userId?._id)
      console.log(response)
      res.status(200).send({
        success: true,
        message: 'Signature verified, payment confirmed ',
        data,
        invoiceUrl
      });
    } catch (error) {
      // logger.log('error', 'razor pay verify error', {
      //   tags: 'razorpay',
      //   additionalInfo: { errorMessage: error.message, error },
      // });
      console.log(error);
      return next(error);
    }
  } else {
    console.log(
      'Signature mismatch',
      'Razorpay : ' + razorPaySignature + ' Generated : ' + exSignature
    );
    return next(new Error('Signature mismatch'));
  }
};

const razorpayWebhook = async (req, res, next) => {
  const verified = verifyWebhookSignature(
    req.body,
    req.headers['x-razorpay-signature']
  );
  if (verified) {
    const entities = req.body.contains;
    try {
      for (const entity of entities) {
        const payload = req.body.payload[entity].entity;

        if (entity === 'subscription') {
          const subscriptionOrderModel = await updateSubsOnDb(
            undefined,
            payload.id,
            payload
          );
          if (req.body.event === 'subscription.activated') {
            await addAdvisoryToUser(subscriptionOrderModel);
          }
          if (req.body.event === 'subscription.cancelled') {
            await removeAdvisoryToUser(subscriptionOrderModel);
          }
          const isTest = process.env.NODE_ENV !== 'production';
          console.log('isTest', isTest);
          const overrideStatus =
            isTest && req.body.event === 'subscription.activated'
              ? 'paid'
              : undefined;
          await updateSubscriptionOrderOnDb(
            subscriptionOrderModel._id,
            subscriptionOrderModel.razorPaySubscriptionId,
            subscriptionOrderModel.advisoryId,
            subscriptionOrderModel.userId,
            subscriptionOrderModel.gst,
            overrideStatus
          );
        }
        if (entity === 'order') {
          if (req.body.event === 'order.paid') {
            const order = await addSessionToUser(
              payload.id,
              req.body.payload['payment'].entity,
              req.body.payload['order'].entity
            );
            await startSubscription(order._id);
          }
        }

        if (req.body.event === 'payment.failed') {
          await updateFailedPaymentStatus(
            payload.order_id,
            req.body.payload['payment'].entity
          );
        }
      }
      return res.status(200).json({ success: true, data: 'Success' });
    } catch (error) {
      // logger.log('error', 'razor pay webhook error', {
      //   tags: 'razorpay',
      //   additionalInfo: { errorMessage: error.message, error },
      // });
      console.log(error);
      next(error);
    }
  } else {
    // logger.log('error', 'Razorpay Webhook Verification failed', {
    //   tags: 'razorpay',
    // });
    console.log('Razorpay Webhook Verification failed');
    next('Razorpay Webhook Verification failed');
  }
};

async function removeAdvisoryToUser(subscriptionOrderModel) {
  const userId = subscriptionOrderModel.userId;
  await UserModel.updateOne(
    { _id: userId },
    {
      $pull: {
        subscribedAdvisories: subscriptionOrderModel.advisoryId,
        activeSubscriptions: subscriptionOrderModel._id,
      },
    }
  );
  return userId;
}

const getInvoice = async (req, res, next) => {
  const errors = validationResult(req);
  console.log({ errors });
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  let userId
  if(req.query.userId){
     userId = req.query.userId

  }
  let customer
  if(res.locals?.user?._id){
     userId = res.locals.user._id 
      customer = {
      name: res.locals.user.name,
      city: '',
      zip: '',
      address: !res.locals.user.address ? '' : res.locals.user.address,
      mobile: res.locals.user.mobile,
      email: res.locals.user.email,
      gst: order.gst ? order.gst : '',
      address: !res.locals.user.address ? "": res.locals.user.address,
      mobile:res.locals.user.mobile,
      email:res.locals.user.email,
      gst:order.gst ? order.gst : '',
    };
  }
  const order = await OrderModel.findById(req.query.orderId);
  if (!order || !(order._id.toString() === req.query.orderId)) {
    return next('Order not found');
  }
  if (order.userId?._id === userId) {
    return next('Order belongs to someone else');
  }
  if (order.status !== 'captured' && order.status !== 'paid') {
    return next('Order is not paid yet');
  }
  if (order.invoiceUrl) {
    return res.status(200).send({
      success: true,
      url: order.invoiceUrl,
    });
  }
  try {
    if (!order.totalAmount) {
      order.totalAmount = order.amount_paid;
      await order.save();
    }
    if (!order.orderId) {
      order.orderId = `RI/ORD/${nanoid(5)}`;
      await order.save();
    }

    

    if (req.query) {
      customer = {
        name: order.billingId?.company ? order.billingId?.company : req.query?.name,
        city: '',
        zip: '',
        address: req.query.address ? req.query.address : '',
        mobile: req.query.mobile,
        email: req.query.email,
        gst: order.billingId?.gstNo ? order.billingId?.gstNo : '',
      };
    }
    const productList = [];
    if (order.advisoryId) {
      const advisory = {
        qty: 1,
        title: order.advisoryId.productTitle,
        amount: order.listAmount / 100,
      };
      productList.push(advisory);
    }
    if (order.programSessions && order.programSessions.length > 0) {
      const perSession = order.listAmount / order.programSessions.length;
      const programSessions = _.map(order.programSessions, (session) => {
        return {
          qty: 1,
          title: session.sessionName,
          amount: perSession / 100,
        };
      });
      productList.push(...programSessions);
    }
    
    InvoiceCounter.findOneAndUpdate(
      {id:"auto"},
      {"$inc":{"sequence":1}},
      {new:true},async(err,cd)=>{
        if(err)console.log(err)
        let counter
          const currentYearEnd = moment().endOf('year'); 
            if(cd === null || moment().isAfter(currentYearEnd) ){   // reset counter at year
              const newValue = await InvoiceCounter.findOneAndUpdate({id:"auto"},{sequence:1})
               newValue.save()
               counter = 1
            }else{
              counter = cd.sequence.toString().padStart(5,"0")
            }
           function InvoiceNumber() {
              let date = moment(order.created_at).format("l");
              const [day,month,year] = date.split("/")
              const paddedDay = day.padStart(2,"0")
            return `${paddedDay}${month}${counter}${year}`;
       }
    const invoiceOrder = {
      number: InvoiceNumber(),
      date: moment(order.created_at).format('ll'),
    };
    const data = await triggerInvoice(customer, productList, invoiceOrder);
    const fileName =
      moment(order.created_at).format() + '_' + invoiceOrder.number + '.pdf';
    const buf = Buffer.from(data.pdf, 'base64');
    const s3Data = await uploadToS3(fileName, buf, 'application/pdf', next);
    order.invoiceUrl = s3Data.Location;
    await order.save();
    return res.status(200).send({
      success: true,
      url: s3Data.Location,
    });
  }
  )
  } catch (error) {
    // logger.log('error', 'get invoice error', {
    //   tags: 'razorpay',
    //   additionalInfo: { errorMessage: error.message, error },
    // });
    console.log(error);
    next(error);
  }
};

async function generateInvoice (items,next){
     
     try{
      let userId
      let customer
      let counter
       if(!items?.invoiceUrl){
            userId = items.userId?._id
             customer = {
           name: items.billingId?.company ? items.billingId?.company :items.userId?.name || '',
           city: '',
           zip: '',
           address: items.userId?.address? items.userId.address:'',
           mobile:items.userId?.mobile || '',
           email: items.userId?.email || '',
           gst: items.gst || '',
           };
          
      const productList = [];
    if (items.advisoryId) {
      const advisory = {
        qty: 1,
        title: items.advisoryId.productTitle,
        amount: items.listAmount / 100,
      };
      productList.push(advisory);
    }
    if (items.programSessions && items.programSessions.length > 0) {
      const perSession = items.listAmount / items.programSessions.length;
      const programSessions = _.map(items.programSessions, (session) => {
        return {
          qty: 1,
          title: session.sessionName,
          amount: perSession / 100,
        };
      });
      productList.push(...programSessions);
    }
function InvoiceNumber(counter) {
              let date = moment(items.created_at).format("l");
              const [day,month,year] = date.split("/")
              const paddedDay = day.padStart(2,"0")
            return `${paddedDay}${month}${counter}${year}`;
       }


  const invoiceSequence = await InvoiceCounter.find({invoiceid:"auto"})
  if(invoiceSequence){
  counter = invoiceSequence[0].sequence.toString().padStart(5,"0")
  const invoiceOrder = {
      number: InvoiceNumber(counter),
      date: moment(items.created_at).format('ll'),
     };
  const data =  await triggerInvoice(customer, productList, invoiceOrder)

  if(data){
        const buf = Buffer.from(data.pdf, 'base64')
        const fileName = moment(items.created_at).format() + '_' + invoiceOrder.number + '.pdf'
        const s3data = await uploadToS3(fileName, buf, 'application/pdf', next)
    
        if(s3data){
             const updateOrder = await OrderModel.findById(items._id)
             updateOrder.invoiceUrl = s3data;
              await updateOrder.save()
              await InvoiceCounter.findOneAndUpdate({},{ $inc: { sequence: 1 } }, { new: true })
              return s3data
        }
  }else{
    // logger.log('info','failed to generate invoice from invoice library ',{
    //  tags:'invoice',
    // }) 
  }
}
}
}
catch (e){
      console.log(e)
     }
    }    
const getInvoiceForAll=async(req,res,next)=>{
try{
   let i
   const order = await OrderModel.find({invoiceUrl:{$exists:false},deleted:false,status:'paid'}) 
   const totalOrder = await OrderModel.find({deleted:false,status:'paid'})
   const invoiceSequence = await InvoiceCounter.find({invoiceid:"auto"}) 
   i=invoiceSequence[0].sequence // loop starts from value of i 
   
  if(order.length === 0){
    return res.status(200).send({message:'no invoice to generate'})
  }else InvoiceGenerator(order,i)


  async function InvoiceGenerator(orders,i){
     let flag =true 
     if(order.length === 0){
      return res.status(200).send({message:'no invoice to generate'})
     }
    while(i <= totalOrder.length && flag){ 
    try{
      const result = await generateInvoice( orders[i -(totalOrder.length-order.length+1)],next)
      const str = result
        let regex = /_(\d+)\.pdf$/;
         let match = str.match(regex);
      const invoiceNumber =match[1] 
      console.log(result,i,orders.length)
      // logger.log('info', 'invoice generated', {
      //   tags: 'invoice',
      //   additionalInfo:{
      //     url:result,
      //     invoicesequence:i,
      //     totalOrder:orders.length,
      //     invoiceNumber:+invoiceNumber
      //   }
      // });
       if(result){
        i++
        flag =true
      }else {
          flag = false
          await new Promise(resolve => setTimeout(resolve, 100000)); // delay if result fails 
          await InvoiceCounter.findOneAndUpdate({invoiceid:'auto'},{sequence:i}) // sequence value update if result fails 
          InvoiceGenerator(orders,i) 
      }
    }catch(e){
      console.log(e);
    }
  }
  if(i-1 === totalOrder.length){
    console.log('all invoice created');
  return res.status(200).send({message:'invoice created successfully'})
  }
  }
}catch(e){
  console.log(e);
}
}
const sendEmailInvoice = async (req, res, next) => {
  const { email, url } = req.body;
  try {
    if (email && url) {
      const msgId = triggerEmailInvoice(email, url);
      res.status(200).json({
        msgId,
        message: 'email was send successfully',
      });
    }
    if (!email) {
      res.status(404).json({ message: 'email does not exist' });
    }
    if (!url) {
      res.status(404).json({ message: 'url does not exist' });
    }
  } catch (e) {
    console.log(e);
  }
};

// const processOrders = async (order,next,res)=>{
//    const batchSize = 10
//    for(let i = 0;i<order.length;i += batchSize){
//     const batch = order.slice(i, i+batchSize) 
//     const invoicePromises = batch.map( async(order)=> createInvoice(order,next))
//     const invoice = await promises.all(invoicePromises)
//     console.log('Batch Processed',invoice.length,'invoices created');
//     res.status(200).send({message:`'Batch Processed',${invoice.length},'invoices created'`})
//    }

// }

// async function getNextInvoiceNumber(items,prevSequence){
//   let counter
//   let invoiceSequence = await InvoiceCounter.find({invoiceid:"auto"})
//   counter = invoiceSequence[0].sequence.toString().padStart(5,"0")
//   console.log(counter);
//   function InvoiceNumber(counter) {
//               let date = moment(items.created_at).format("l");
//               const [day,month,year] = date.split("/")
//               const paddedDay = day.padStart(2,"0")
//             return `${paddedDay}${month}${counter}${year}`;
//        }

//   return InvoiceNumber(counter)

// }
// const createInvoice = async (items,next)=>{

//   try {

//      let userId
//       let customer
      
//        if(!items?.invoiceUrl){
//             userId = items.userId?._id
//              customer = {
//            name: items.billingId?.company ? items.billingId?.company :items.userId?.name,
//            city: '',
//            zip: '',
//            address: items.userId?.address? items.userId.address:'',
//            mobile:items.userId?.mobile || '',
//            email: items.userId?.email || '',
//            gst: items.gst || '',
//            };
          
//       const productList = [];
//     if (items.advisoryId) {
//       const advisory = {
//         qty: 1,
//         title: items.advisoryId.productTitle,
//         amount: items.listAmount / 100,
//       };
//       productList.push(advisory);
//     }
//     if (items.programSessions && items.programSessions.length > 0) {
//       const perSession = items.listAmount / items.programSessions.length;
//       const programSessions = _.map(items.programSessions, (session) => {
//         return {
//           qty: 1,
//           title: session.sessionName,
//           amount: perSession / 100,
//         };
//       });
//       productList.push(...programSessions);
//     }


  
 
//   // counter = invoiceSequence[0].sequence.toString().padStart(5,"0")
//   const prevSequence = await InvoiceCounter.findOneAndUpdate({invoiceid:"auto"},{ $inc: { sequence: 1 } }, { new: true })
//   const invoiceNumber = await getNextInvoiceNumber(items,prevSequence)
//   const invoiceOrder = {
//       number: invoiceNumber,
//       date: moment(items.created_at).format('ll'),
//      };
//   const data =  await triggerInvoice(customer, productList, invoiceOrder)
//   if(data){
//         const buf = Buffer.from(data.pdf, 'base64')
//         const fileName = moment(items.created_at).format() + '_' + invoiceOrder.number + '.pdf'
//         const s3data = await uploadToS3(fileName, buf, 'application/pdf')
        
//         if(s3data){
//              const updateOrder = await OrderModel.findById(items._id)
//              updateOrder.invoiceUrl = s3data;
//               await updateOrder.save()
//               return s3data
//         }
//   }
// }
    
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// const generateInvoiceBatchWise = async(req,res,next)=>{
//   const order = await OrderModel.find({invoiceUrl:{$exists:false},deleted:false,status:'paid'}) 
//   processOrders(order,next,res)
//   .then(()=>{
//     return res.status(200).send({message:'all invoices generated'})
//   })
//   .catch(()=>{
//     // return res.status(500).send({message:'something went wrong'})
//   })
  
// }
const checkPaymentEnvironment = (req, res, next) => {
  res.status(200).send({
    env: process.env.RAZORPAY_ENV,
  });
};


module.exports = {
  verify,
  verifyAdvisory,
  getInvoice,
  razorpayWebhook,
  removeAdvisoryToUser,
  checkPaymentEnvironment,
  sendEmailInvoice,
  getInvoiceForAll,
  // generateInvoiceBatchWise  
};
