const createError = require("http-errors");
const express = require("express");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const axios = require("axios");
require("dotenv").config();
const logger = require("./utils/logger");
const { sendService } = require("./service/slack_service");
const {
  countDocumentsDBSource,
  copyDocumentsInChunks,
} = require("./service/mongo_transfer");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const riskProfileRouter = require("./routes/riskProfile");
const agreementRouter = require("./routes/agreement");
const hostProfileRouter = require("./routes/hostProfile");
const learningRouter = require("./routes/learning");

const faqRouter = require("./routes/faq");
const kycRouter = require("./routes/kyc");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const otpRouter = require("./routes/otp");
const resetRouter = require("./routes/reset");
const paymentRouter = require("./routes/payments");
const advisoryRouter = require("./routes/advisory");
const enrollRouter = require("./routes/enroll");
const uploadRouter = require("./routes/upload");
const cronRouter = require("./routes/cronJobs");
const notificationRouter = require("./routes/notification");
const newnotificationRouter = require("./routes/newnotification");
const contactRouter = require("./routes/contact");
const brokerRouter = require("./routes/broker");
const betaAccessRouter = require("./routes/betaAccess");
const couponRouter = require("./routes/coupon");
const subscriptionRouter = require("./routes/subscription");
const HniRouter = require("./routes/hni");
const chatRouter = require("./routes/chat");
const messageTypes = require("./routes/chatTypes");

const conn = require("./service/mongo.db");
const cron = require("croner");
// const orderModel = require('./model/order.model');
conn.on("error", (error) => {
  console.log(error);
  logger.log("error", "mongodb connection error", {
    tags: "http",
    additionalInfo: { errorMessage: error.message, error },
  });
});

conn.once("connected", () => {
  console.log("Database Connected");
  logger.log("info", "mongodb connection successful", {
    tags: "database",
  });
});

require("dd-trace").init({
  logInjection: true,
});

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(","),
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  logger.log("info", `Requesting ${req.method} ${req.originalUrl}`, {
    tags: "http",
    additionalInfo: { body: req.body, headers: req.headers },
  });
  next();
});

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/riskProfile", riskProfileRouter);

app.use("/kyc", kycRouter);
app.use("/jobs", cronRouter);
app.use("/agreement", agreementRouter);
app.use("/hostProfile", hostProfileRouter);
app.use("/learning", learningRouter);
app.use("/faq", faqRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/otp", otpRouter);
app.use("/reset", resetRouter);
app.use("/payments", paymentRouter);
app.use("/enroll", enrollRouter);
app.use("/advisory", advisoryRouter);
app.use("/image", uploadRouter);
app.use("/notification", notificationRouter);
app.use("/newnotification", newnotificationRouter);
app.use("/contact", contactRouter);
app.use("/broker", brokerRouter);
app.use("/beta", betaAccessRouter);
app.use("/coupon", couponRouter);
app.use("/subscription", subscriptionRouter);
app.use("/hni", HniRouter);
app.use("/chat", chatRouter);
app.use("/chat", messageTypes);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

cron("25 20 * * 1-5", { timezone: "Asia/Kolkata" }, async () => {
  const port = process.env.PORT || "3000";
  try {
    await axios.post("http://localhost:" + port + "/jobs/fetch-new-bhavcopy");
  } catch (error) {
    console.error(error);
    // logger.log('error', 'bhavcopy error', {
    //   tags: 'http',
    //   additionalInfo: { errorMessage: error.message, error },
    // });
  }
});

// cron('54 23 * * 1-5', { timezone: 'Asia/Kolkata' }, async () => {
//   const port = process.env.PORT || '3000';
//   try {
//     await axios.post(
//       'http://localhost:' + port + '/jobs/close-expired-advices'
//     );
//   } catch (error) {
//     console.error(error);
//     logger.log('error', 'close expired advices error', {
//       tags: 'http',
//       additionalInfo: { errorMessage: error.message, error },
//     });
//   }
// });

cron("0 0 * * *", { timezone: "Asia/Kolkata" }, async () => {
  const port = process.env.PORT || "3000";
  try {
    await axios.post("http://localhost:" + port + "/subscription/check");
    await sendService("Subscription check ran");
  } catch (error) {
    console.error(error);
    // logger.log('error', 'subscription check error', {
    //   tags: 'http',
    //   additionalInfo: { errorMessage: error.message, error },
    // });
  }
});

// cron("0 1 * * *", { timezone: "Asia/Kolkata" }, async () => {
//   try {
//     if (process.env.NODE_ENV === "production") {
//       await countDocumentsDBSource(copyDocumentsInChunks);
//     }
//   } catch (error) {
//     console.error(error);
//     // logger.log('error', 'Database cloning cron error', {
//     //   tags: 'cron',
//     //   additionalInfo: { errorMessage: error.message, error },
//     // });
//   }
// });

// cron('01 15 * * *',{timezone:'Asia/Kolkata'},async()=>{
//   console.log('invoice cron job ran');
//    try{
//     const order = await orderModel.find({invoiceUrl:{$exists:false},deleted:false,status:'paid'})
//    console.log(order.length);
//     ProcessInvoice(order)
//      async function ProcessInvoice (order){
//       for (const items of order){
//         try{
//           if(!items.invoiceUrl)
//           {
//             const port = process.env.PORT || '3006';
//              await axios.post(`http://localhost:${port}/payments/invoice?orderId=${items?._id}&userId=${items.userId?._id}&name=${items.userId?.name}&address=${items.userId?.address? items.userId.address:''}&mobile=${items.userId?.mobile}&email=${items.userId?.email}&gst=${items.userId?.gst}`)
//              await new Promise(resolve => setTimeout(resolve, 1000));// api call after 2s
//           }
//           }catch(e){
//           console.log(e);
//         }
//       }
//      }

//    }catch(error){
//     console.error(error);
//     logger.log('error', 'invoice not able to create', {
//       tags: 'cron',
//       additionalInfo: { errorMessage: error.message, error },
//     });
//    }
// })
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    status: false,
    message: err.message,
    data: JSON.stringify(
      res.locals.error,
      Object.getOwnPropertyNames(res.locals.error)
    ),
  });
});

module.exports = app;
