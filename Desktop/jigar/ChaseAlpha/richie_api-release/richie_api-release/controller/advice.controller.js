const AdviceModel = require("../model/advice.model");
const ProductModel = require("../model/product.model");
const StockModel = require("../model/stock.model");
const Subscription = require("../model/subscription.model");
const _ = require("lodash");
const { notifyProduct } = require("./notification.controller");
const moment = require("moment");
const { sendService } = require("../service/slack_service");
const { userRedirectionBroker } = require("../data/constants");
const { addPercent } = require("../utils/utilityFunctions");
const userModel = require("../model/user.model");
const productModel = require("../model/product.model");
const { mongoose } = require("mongoose");
const symbolModel = require("../model/symbol.model");
const expiryDateModel = require("../model/expiryDate.model");
const strikePriceModel = require("../model/strikePrice.model");
const adviceformsModel = require("../model/adviceforms.model");
const { NotifyProduct } = require("./newnotification.controller");
const { getSymbolData, emitter } = require("../service/true_data_service");
const adminAdviceModel = require("../model/adminAdvice.model");
const { ObjectId } = require('mongodb');
const userAdviceModel = require("../model/userAdvice.model");
const { createMessage } = require("../controller/chat.controller");
const newnotificationModel = require("../model/newnotification.model");
const chatModel = require("../model/chat.model");
const strategyModel = require("../model/strategy.model");
const { getLiveOptionChain, getliveStockRate } = require("../service/true_data_service");
const adviceGrid = async (req, res, next) => {
  let query = res.locals.query || {};
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const statusvalue = req.query.statusValue;
  const removedSpaceSearch = req.query.searchText;
  const product = req.query.product;
  const search = removedSpaceSearch?.split(" ").join("");
  if (statusvalue) {
    query = {
      ...query,
      status: statusvalue,
    };
  }
  let statusdata;
  let result;
  try {
    const researchAdmin = await userModel.findById(res.locals.user._id);
    if (
      researchAdmin &&
      researchAdmin.type.length === 1 &&
      researchAdmin.type[0] === 5
    ) {  
      const adviceIds = await productModel.find({
        productTitle: { $in: researchAdmin?.viewAccess?.product },
      });
      query.advisoryId = { $in: adviceIds.map((advice) => advice._id) };
    }
    let count = await AdviceModel.countDocuments(query);
    let totalPages = Math.ceil(count / limit);

    if (search) {
      const regex = new RegExp(search, "i");
      const filter = {
        $or: [
          { nameOfUnderlying: regex },
          { instrument: regex },
          { product: regex },
        ],
      };
      const adviceIds = await AdviceModel.find({ product: "single test" });
      query.adviceId = { $in: adviceIds.map((advice) => advice.id) };
    }
    // if (!isNaN(page) && !isNaN(limit)) {
    //   console.log(query.adviceId);
    //   result = await AdviceModel.find(query, null, {
    //     sort: { _id: -1 },
    //     skip: (page - 1) * limit,
    //     limit: limit,
    //   });
    // } else {
    //   result = await AdviceModel.find(query, null, {
    //     sort: { _id: -1 },
    //   });
    // }

    // count and data for status

    const sort = { _id: -1 };
    const options = { sort };
    if (!isNaN(page) && !isNaN(limit)) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }
    result = await AdviceModel.find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip);
    try {
      let freshTrade = await AdviceModel.find({ status: "freshTrade" });
      let open = await AdviceModel.find({ status: "open" });
      let exit = await AdviceModel.find({ status: "exit" });
      let stoplossTriggered = await AdviceModel.find({
        status: "stoplossTriggered",
      });
      let bookProfit = await AdviceModel.find({ status: "bookProfit" });
      const researchAdmin = await userModel.findById(res.locals.user._id);
      if (
        researchAdmin &&
        researchAdmin.type.length === 1 &&
        researchAdmin.type[0] === 5
      ) {
        const adviceIds = await productModel.find({
          productTitle: { $in: researchAdmin?.viewAccess?.product },
        });
        advisoryId = { $in: adviceIds.map((advice) => advice._id) };
        freshTrade = await AdviceModel.find({
          advisoryId,
          status: "freshTrade",
        });
        open = await AdviceModel.find({ advisoryId, status: "open" });
        exit = await AdviceModel.find({ advisoryId, status: "exit" });
        stoplossTriggered = await AdviceModel.find({
          advisoryId,
          status: "stoplossTriggered",
        });
        bookProfit = await AdviceModel.find({
          advisoryId,
          status: "bookProfit",
        });
      }
      statusdata = {
        freshTrade,
        open,
        exit,
        stoplossTriggered,
        bookProfit,
      };
    } catch (e) {
      console.log(e);
    }

    let data = _.map(result, (advice) => {
      let name = "";
      name += advice.nameOfUnderlying || "";
      name += advice.strategy[0]?.expiry || "";
      name += advice.strategy[0]?.strike || "";
      name += advice.strategy[0]?.optionType || "";
      return {
        id: advice._id,
        date: advice.createdAt,
        time: advice.createdAt,
        nameOfUnderlying: name,
        productType: advice.productTypeId?.name ?? "",
        instrument: advice.instrumentId?.name ?? "",
        product: advice.advisoryId?.productTitle ?? "",
        analyst: advice.analyst,
        entry: advice.entryLowerRange + " - " + advice.entryUpperRange,
        stopLoss: advice.stopLoss,
        target1: advice.target1,
        target2: advice.target2,
        target3: advice.target3,
        status: advice.status,
        timeFrame: advice.timeFrameId?.name ?? "",
        action: advice.strategy[0]?.action ?? "",
        cmp: advice.strategy[0]?.ltp,
        returnPercentage: 0,
        change: 0,
        perLotProfit: 0,
        trueDataSymbol: advice.strategy[0].trueDataSymbol,
        lotSize: advice.strategy[0].minQty,
        updates: advice.updates[advice.updates.length - 1],
      };
    });

    if (product) {
      const result = await ProductCount(product, page, limit);
      data = _.map(result.data, (advice) => {
        let name = "";
        name += advice.nameOfUnderlying || "";
        name += advice.strategy[0]?.expiry || "";
        name += advice.strategy[0]?.strike || "";
        name += advice.strategy[0]?.optionType || "";
        return {
          id: advice._id,
          date: advice.createdAt,
          time: advice.createdAt,
          nameOfUnderlying: name,
          productType: advice.productTypeId?.name ?? "",
          instrument: advice.instrumentId?.name ?? "",
          product: advice.advisoryId?.productTitle ?? "",
          analyst: advice.analyst,
          entry: advice.entryLowerRange + " - " + advice.entryUpperRange,
          stopLoss: advice.stopLoss,
          target1: advice.target1,
          target2: advice.target2,
          target3: advice.target3,
          status: advice.status,
          timeFrame: advice.timeFrameId?.name ?? "",
          action: advice.strategy[0]?.action ?? "",
          cmp: advice.strategy[0]?.ltp,
          returnPercentage: 0,
          change: 0,
          perLotProfit: 0,
          trueDataSymbol: advice.strategy[0].trueDataSymbol,
          lotSize: advice.strategy[0].minQty,
          updates: advice.updates[advice.updates.length - 1],
        };
      });
      totalPages = Math.ceil(result.count / limit);
    }

    const wholedata = await AdviceModel.find().sort(options.sort);
    const productCount = {
      cashstockpositionCount: wholedata.filter(
        (m) => m.advisoryId?.productTitle === "Cash Stocks Poisitional"
      ).length,
      energyandgasCount: wholedata.filter(
        (m) => m.advisoryId?.productTitle === "Energy & Gas"
      ).length,
      metalCount: wholedata.filter(
        (m) => m.advisoryId?.productTitle === "Metals"
      ).length,
      niftyoptionCount: wholedata.filter(
        (m) => m.advisoryId?.productTitle === "NIFTY Options"
      ).length,
      bangbangniftyCount: wholedata.filter(
        (m) => m.advisoryId?.productTitle === "Bang Bang BANKNIFTY"
      ).length,
      momentfutureCount: wholedata.filter(
        (m) => m.advisoryId?.productTitle === "Momentum Futures"
      ).length,
      indexfutureCount: wholedata.filter(
        (m) => m.advisoryId?.productTitle === "Index Futures"
      ).length,
      bullionCount: wholedata.filter(
        (m) => m.advisoryId?.productTitle === "Bullion"
      ).length,
      optioncomboCount: wholedata.filter(
        (m) => m.advisoryId?.productTitle === "Options Combo"
      ).length,
      indexoptioncomboCount: wholedata.filter(
        (m) => m.advisoryId?.productTitle === "Index Option Combo"
      ).length,
      futurecomboCount: wholedata.filter(
        (m) => m.advisoryId?.productTitle === "Futures Combo"
      ).length,
      stockoptionCount: wholedata.filter(
        (m) => m.advisoryId?.productTitle === "Stock Options"
      )?.length,
      TotalAdvice: await AdviceModel.countDocuments(),
    };

    result = {
      page: page,
      size: data.length,
      total: count,
      pageTotal: totalPages,
      data,
      statusdata,
      productCount: productCount,
    };
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
const adminAdvicelist = async (req, res, next) => {
  let query = res.locals.query || {};
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const statusvalue = req.query.statusValue;
  const removedSpaceSearch = req.query.searchText;
  const product = req.query.product;
  const search = removedSpaceSearch?.split(" ").join("");
  try {
    const mainadvicelist = await AdviceModel.countDocuments();
    const adminadvicelist = await adminAdviceModel.countDocuments();
    if (mainadvicelist !== adminadvicelist) {
      await updateAdviceadminlist();
    }
    if (statusvalue) {
      let queryvalue 
      if(statusvalue === 'open'){
        queryvalue={
          ...query,
          status: {$in:['open','bookPartialProfit']},
        };
      }else{
        queryvalue={
          ...query,
          status: statusvalue,
        }
      }
      query = queryvalue;
    }
    if (product) {
      query = {
        ...query,
        product: product,
      };
    }
    let count = await adminAdviceModel.countDocuments(query);
    let totalPages = Math.ceil(count / limit);
    const sort = { _id: -1 };
    const options = { sort };
    if (!isNaN(page) && !isNaN(limit)) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }
    result = await adminAdviceModel
      .find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip);
   
    result = {
      page: page,
      size: result.length,
      total: count,
      pageTotal: totalPages,
      data: result,
      // statusdata:getCountStatusandProduct(),
      // productCount: productCount,
    };
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
};
const userAdvicelist = async (req, res, next) => {
  const perPage = parseInt(req.body.limit) || 10;
  const skip = parseInt(req.body.skip) || 0;
  const filterStatus = req.body.filterStatus;
  const filterProductId = req.body.productId.toString();
  const userId = res.locals.user._id;
  let subscribeProducts;
  let productRelated = [];
  let filterStatusquery;
  try {
    // Check if userAdviceModel needs to be updated
    const mainadvicelist = await AdviceModel.countDocuments();
    const useradvicelist = await userAdviceModel.countDocuments();
    if (mainadvicelist !== useradvicelist) {
      await updateuserAdvicelist();
    }

    // Fetch active subscriptions for the user with advisory details
    const subscriptions = await Subscription.find({
      userId: userId,
      active: true,
    }).populate("advisoryId");
    // Collect product titles from subscriptions
    const allProducts = await ProductModel.find().select("_id productTitle");
    if (subscriptions.length === 0) {
      return res.status(403).send({
        status: false,
        message: "You don't have any active subscription",
      });
    }
    //subscribed product list
    listofproducts = subscriptions.map((product) => {
      if (product.advisoryId.relatedProductsIds.length > 0) {
        const relatedproducts = product.advisoryId.relatedProductsIds.map(
          (title) => {
            const prod = allProducts.filter((id) => {
              return id._id.toString() === title.toString();
            });
            return prod[0].productTitle;
          }
        );
        productRelated.push({
          [product.advisoryId.productTitle]: relatedproducts,
        });
        return [product.advisoryId.productTitle, ...relatedproducts];
      }
      return product.advisoryId.productTitle;
    });
    subscribeProducts = [...new Set(listofproducts.flat())];
    // Filter by productId if provided
    if (filterProductId !== "") {
      const filterproduct = allProducts
        .filter((id) => id._id.toString() === filterProductId)
        .map((title) => title.productTitle);
        subscribeProducts = subscribeProducts.includes(filterproduct[0])
        ? filterproduct[0]
        : [];
      }
      if (filterStatus.length <= 0) {
        filterStatusquery = {};
      }
      if (filterStatus.length >= 1) {
        filterStatusquery = { status: { $in: filterStatus } };
      }
      const advices = await userAdviceModel
      .find({ ...filterStatusquery, product: { $in: subscribeProducts } })
      .sort({ updatedAt: -1 });
      // filter based on its subscribption dates
    let  allsubscriptions
    allsubscriptions = await Subscription.find({
      userId: userId,
    }).populate("advisoryId");
    if(filterStatus?.includes('exit')||filterStatus?.includes('stoplossTriggered')||filterStatus?.includes('bookProfit') ){
     // Fetch all subscriptions for the user with advisory details
     allsubscriptions = await Subscription.find({
      userId: userId,
    }).populate("advisoryId");
    }
    const filteredadvices = advices.filter((product) => {
      let userSubscription = subscriptions.filter(
        (prod) => prod.advisoryId.productTitle === product.product
      );
      // check for related products
      if (userSubscription.length === 0) {
        userSubscription = subscriptions.filter((prod) => {
          const subprod = productRelated.filter((name) =>
            Object.values(name).flat().includes(product.product)
          );
          return prod.advisoryId.productTitle === Object.keys(subprod[0])[0];
        });
      }
      // check for if product is subscribed twice use OLDEST subscribtion
      
      if (userSubscription.length > 1) {
        userSubscription = userSubscription.reduce((max, current) => {
          const enddate = new Date(current.startTime);
          const maxendate = new Date(max.startTime);
          return enddate < maxendate ? current : max;
        }, userSubscription[0]);
      }
      if (userSubscription.length === 1) {
        userSubscription = userSubscription[0];
      }

      if(filterStatus.includes('exit')||filterStatus.includes('stoplossTriggered')||filterStatus.includes('bookProfit')){
        let alluserSubscription = allsubscriptions.filter(
          (prod) => {
            if(prod.advisoryId.productTitle !== product.product){
              const subprod = productRelated.filter((name) =>
              Object.values(name).flat().includes(product.product)
            );
            return subprod.length>0
            }
            return prod.advisoryId.productTitle === product.product
          }
        );
        userSubscription = alluserSubscription.reduce((max, current) => {
          const enddate = new Date(current.startTime);
          const maxendate = new Date(max.startTime);
          return enddate < maxendate ? current : max;
        }, alluserSubscription[0]);
        const startdate = new Date(userSubscription?.startTime);
        const advicedate = new Date(product.createdAt);
        // console.log(alluserSubscription.length,userSubscription?.startTime,product.product,advicedate, advicedate > startdate)
        return advicedate > startdate   
      }
      if(filterStatus?.includes('open') && product.product === 'Cash Stocks Poisitional' ){
        const activecash = subscriptions.some((product)=>product.advisoryId.productTitle === 'Cash Stocks Poisitional')
        const inactivecash = allsubscriptions.some((product)=>{
          if(product.advisoryId.productTitle === 'Cash Stocks Poisitional'){
            if(!product.active){
              return true
            }
          }
        })
        if(activecash && !inactivecash){return true}
        return activecash&&inactivecash
      }
      // console.log(userSubscription,'sdoaihoh\hdsofah  iohdsah')
      const startdate = new Date(userSubscription?.startTime);
      const enddate = new Date(userSubscription?.endTime);
      const advicedate = new Date(product.createdAt);
      return advicedate > startdate && advicedate < enddate;
    });
    const startIndex = skip;
    const endIndex = skip + perPage;
    const data = filteredadvices.map((advice) => {
        let updates = advice?.updates
        if(advice.status === 'open' || advice.status ==='freshTrade'){
          updates=[]
        }
        return {
          _id: advice._id,
          createdAt: moment(advice.createdAt)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          updatedAt: moment(advice.updatedAt)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          remarks: advice.remarks,
          riskReward: advice.riskReward,
          holdingPeriod: advice.holdingPeriod,
          lotSize: advice.strategy[0].minQty,
          maxLoss: advice.maxLoss,
          maxProfit: advice.maxProfit,
          stopLoss: advice.stopLoss,
          action: advice.strategy[0]?.action ?? "",
          target1: advice.target1,
          target2: advice.target2,
          target3: advice.target3,
          productType: advice.productTypeId,
          entryLowerRange: advice.entryLowerRange,
          entryUpperRange: advice.entryUpperRange,
          instrumentName: advice.instrumentName,
          nameOfUnderlying: advice.nameOfUnderlying,
          status: advice.status,
          analyst:advice.analyst,
          // updates:[advice.updates],
          updates: updates,
          strategy: advice.strategy,
        };
      })
      .slice(startIndex, endIndex);
    return res.status(200).send({
      status: true,
      count: filteredadvices.length,
      message: "Success",
      data: data,
    });
  } catch (error) {
    console.log(error)
  }
};
const updateuserAdvicelist = async()=>{
  try {
    const mainadvicelist = await AdviceModel.find({});
    const useradvicelist = await userAdviceModel.find({});
    const mainadviceIds = mainadvicelist?.map((id) => id._id.toString());
    const useradviceIds = useradvicelist?.map((id) => id._id.toString());
    const concatIDs = mainadviceIds.concat(useradviceIds);
    const uniqueIds = concatIDs.filter((value, index, self) => {
      return self.indexOf(value) === self.lastIndexOf(value);
    });
    const uniqueObjectIDObjects = Array.from(uniqueIds).map(
      (id) => new ObjectId(id)
    );
    const userlistdata = await AdviceModel.find({
      _id: { $in: uniqueObjectIDObjects },
    });
    
    const updateduserlistdata = userlistdata.map((advice) => {
      return {
        _id:advice._id,
        createdAt: advice.createdAt,
        updatedAt: advice.createdAt,
        remarks:advice.remarks,
        riskReward:advice.riskReward,
        holdingPeriod:advice.holdingPeriod,
        lotSize: advice.strategy[0].minQty,
        maxLoss:advice.maxLoss,
        maxProfit:advice.maxProfit,
        stopLoss: advice.stopLoss,
        action: advice.strategy[0]?.action ?? "",
        target1: advice.target1,
        target2: advice.target2,
        target3: advice.target3,
        productType: advice.productTypeId?.name ?? "",
        entryLowerRange:advice.entryLowerRange,
        entryUpperRange:advice.entryUpperRange,
        instrumentName: advice.instrumentId?.name ?? "",
        nameOfUnderlying: advice.nameOfUnderlying,
        status: advice.status,
        strategy:{
          _id:advice.strategy[0]._id,
          name:advice.strategy[0]?.name,
          expiry:advice.strategy[0]?.expiry,
          strike:advice.strategy[0]?.strike,
          optionType:advice.strategy[0]?.optionType,
          action:advice.strategy[0]?.action,
          quantity:advice.strategy[0]?.quantity,
          ltp:advice.strategy[0]?.ltp,
          minQty:advice.strategy[0]?.minQty,
          trueDataSymbol:advice.strategy[0]?.trueDataSymbol,
          kiteSymbol:advice.strategy[0]?.kiteSymbol,
          angelOneSymbol:advice.strategy[0]?.angelOneSymbol,
          __v:advice.strategy[0].__v
        },
        updates: advice.updates,
        product: advice.advisoryId?.productTitle ?? "",
      };
    });
    await userAdviceModel.insertMany(updateduserlistdata)
  } catch (error) {
    console.log(error);
  }
}
const getCountStatusandProduct = async (req,res,next)=>{
  try {
    let statusdata;
    let productCount={};
    let alladvice = await adminAdviceModel.countDocuments({})
    let freshTrade = await adminAdviceModel.countDocuments({ status: "freshTrade" });
    let open = await adminAdviceModel.countDocuments({ status: "open" });
    let exit = await adminAdviceModel.countDocuments({ status: "exit" });
    let stoplossTriggered = await adminAdviceModel.countDocuments({
      status: "stoplossTriggered",
    });
    let bookProfit = await adminAdviceModel.countDocuments({ status: "bookProfit" });
    let bookPartialProfit = await adminAdviceModel.countDocuments({ status: "bookPartialProfit" });
    let products = await productModel.distinct('productTitle')
    for(let i = 0;i<products.length;i++){
      const count = await adminAdviceModel.countDocuments({product:products[i]})
       productCount = {
        ...productCount,
        [products[i]]:count
      }
    }
    statusdata = {
      freshTrade,
      open,
      exit,
      stoplossTriggered,
      bookProfit,
      bookPartialProfit,
      alladvice
    };
    res.status(200).send({
      statusdata,
      productCount
    })
  } catch (error) {
    console.log(error)
  }
}
const updateAdviceadminlist = async () => {
  try {
    const mainadvicelist = await AdviceModel.find({});
    const adminadvicelist = await adminAdviceModel.find({});
    const mainadviceIds = mainadvicelist?.map((id) => id._id.toString());
    const adminadviceIds = adminadvicelist?.map((id) => id._id.toString());
    const concatIDs = mainadviceIds.concat(adminadviceIds);
    const uniqueIds = concatIDs.filter((value, index, self) => {
      return self.indexOf(value) === self.lastIndexOf(value);
    });
    const uniqueObjectIDObjects = Array.from(uniqueIds).map(
      (id) => new ObjectId(id)
    );
    const adminlistdata = await AdviceModel.find({
      _id: { $in: uniqueObjectIDObjects },
    });
    
    const updatedadminlistdata = adminlistdata.map((advice) => {
      return {
        _id: advice._id,
        change: 0,
        date: advice.createdAt,
        stopLoss: advice.stopLoss,
        action: advice.strategy[0]?.action ?? "",
        target1: advice.target1,
        target2: advice.target2,
        target3: advice.target3,
        lotSize: advice.strategy[0].minQty,
        perLotProfit: 0,
        returnPercentage: 0,
        analyst: advice.analyst,
        product: advice.advisoryId?.productTitle ?? "",
        productType: advice.productTypeId?.name ?? "",
        productId:advice.advisoryId._id,
        entry: advice.entryLowerRange + " - " + advice.entryUpperRange,
        instrument: advice.instrumentId?.name ?? "",
        nameOfUnderlying: advice.nameOfUnderlying,
        status: advice.status,
        timeFrame: advice.timeFrameId?.name ?? "",
        trueDataSymbol: advice.strategy[0].trueDataSymbol,
        cmp: advice.strategy[0]?.ltp,
        updates:advice.updates,
        optionStrike: advice.strategy[0].strike,
        expiry: advice.strategy[0].expiry,
        optionType: advice.strategy[0].optionType,
      };
    });
    await adminAdviceModel.insertMany(updatedadminlistdata)
  } catch (error) {
    console.log(error);
  }
};
const updatebyidadviceAdminlist= async (updateBody,id)=>{
     try {
      const result = await adminAdviceModel.findByIdAndUpdate({_id:id}, {
        $push: { updates: updateBody },
        $set: { status: updateBody.newStatus },
      },
      { new: true })
     } catch (error) {
      console.log(error)
     }
}
const updatebyiduserAdvicelist= async (updateBody,id)=>{
  try {
    console.log(updateBody,id)
   const result = await userAdviceModel.findOneAndUpdate(
    { _id:id },
    {
      $push: { updates: updateBody },
      $set: { status: updateBody.newStatus },
    },
    { new: true }
  )
  } catch (error) {
   console.log(error)
  }
}
const ProductCount = async (product, page, limit) => {
  try {
    const sort = { _id: -1 };
    const options = { sort };
    const wholedata = await AdviceModel.find().sort(options.sort);

    switch (product) {
      case "Cash Stocks Poisitional":
        data = wholedata.filter(
          (m) => m.advisoryId?.productTitle === "Cash Stocks Poisitional"
        );
        if (!isNaN(page) && !isNaN(limit)) {
          const skip = (page - 1) * limit;
          data = data.slice(skip, data.length);
        }

        return { data, count: data.length };
        break;
      case "Energy & Gas":
        data = wholedata.filter(
          (m) => m.advisoryId?.productTitle === "Energy & Gas"
        );
        if (!isNaN(page) && !isNaN(limit)) {
          const skip = (page - 1) * limit;
          data = data.slice(skip, data.length);
        }
        return { data, count: data.length };
        break;
      case "Metals":
        data = wholedata.filter((m) => m.advisoryId?.productTitle === "Metals");
        if (!isNaN(page) && !isNaN(limit)) {
          const skip = (page - 1) * limit;
          data = data.slice(skip, data.length);
        }
        return { data, count: data.length };
        break;
      case "NIFTY Options":
        data = wholedata.filter(
          (m) => m.advisoryId?.productTitle === "NIFTY Options"
        );
        if (!isNaN(page) && !isNaN(limit)) {
          const skip = (page - 1) * limit;
          data = data.slice(skip, data.length);
        }
        return { data, count: data.length };
        break;
      case "Bang Bang BANKNIFTY":
        data = wholedata.filter(
          (m) => m.advisoryId?.productTitle === "Bang Bang BANKNIFTY"
        );
        if (!isNaN(page) && !isNaN(limit)) {
          const skip = (page - 1) * limit;
          data = data.slice(skip, data.length);
        }
        return { data, count: data.length };
        break;
      case "Momentum Futures":
        data = wholedata.filter(
          (m) => m.advisoryId?.productTitle === "Momentum Futures"
        );
        if (!isNaN(page) && !isNaN(limit)) {
          const skip = (page - 1) * limit;
          data = data.slice(skip, data.length);
        }
        return { data, count: data.length };
        break;
      case "Index Futures":
        data = wholedata.filter(
          (m) => m.advisoryId?.productTitle === "Index Futures"
        );
        if (!isNaN(page) && !isNaN(limit)) {
          const skip = (page - 1) * limit;
          data = data.slice(skip, data.length);
        }
        return { data, count: data.length };
        break;
      case "Bullion":
        data = wholedata.filter(
          (m) => m.advisoryId?.productTitle === "Bullion"
        );
        if (!isNaN(page) && !isNaN(limit)) {
          const skip = (page - 1) * limit;
          data = data.slice(skip, data.length);
        }
        return { data, count: data.length };
        break;
      case "Options Combo":
        data = wholedata.filter(
          (m) => m.advisoryId?.productTitle === "Options Combo"
        );
        if (!isNaN(page) && !isNaN(limit)) {
          const skip = (page - 1) * limit;
          data = data.slice(skip, data.length);
        }
        return { data, count: data.length };
        break;
      case "Index Option Combo":
        data = wholedata.filter(
          (m) => m.advisoryId?.productTitle === "Index Option Combo"
        );
        if (!isNaN(page) && !isNaN(limit)) {
          const skip = (page - 1) * limit;
          data = data.slice(skip, data.length);
        }
        return { data, count: data.length };
        break;
      case "Futures Combo":
        data = wholedata.filter(
          (m) => m.advisoryId?.productTitle === "Futures Combo"
        );
        if (!isNaN(page) && !isNaN(limit)) {
          const skip = (page - 1) * limit;
          data = data.slice(skip, data.length);
        }
        return { data, count: data.length };
        break;
      case "Stock Options":
        data = wholedata.filter(
          (m) => m.advisoryId?.productTitle === "Stock Options"
        );
        if (!isNaN(page) && !isNaN(limit)) {
          const skip = (page - 1) * limit;
          data = data.slice(skip, data.length);
        }
        return { data, count: data.length };
        break;
    }
  } catch (e) {
    console.log(e);
  }
};

const updateAdviceData = async (req, res, next) => {
  const updateBody = req.body;
  let id = req.params.id;
  try {
    let objectkey = Object.keys(updateBody)[0]
    const objectvalue = Object.values(updateBody)[0]
    let advicevalue = {}
    if(objectkey === 'entry'){
       advicevalue = {
        entryLowerRange: objectvalue.split(" - ")[0],
        entryUpperRange: objectvalue.split(" - ")[1],
      };
    }else {
      advicevalue = {
      [objectkey]:objectvalue
    }
    }
    await AdviceModel.findOneAndUpdate({_id:id},advicevalue)
    await userAdviceModel.findOneAndUpdate({_id:id},advicevalue)
    await adminAdviceModel.findOneAndUpdate({_id:id},{
      [objectkey]:objectvalue
    })
    let advice = await AdviceModel.findById(id).populate('strategy')
    if(objectkey === 'optionStrike' ||objectkey === 'optionType'){
      if(objectkey === 'optionStrike'){
        objectkey='strike'
      }
      await strategyModel.findOneAndUpdate({_id:advice.strategy[0]._id},{
        [objectkey]:objectvalue
      })
       advice = await AdviceModel.findById(id).populate('strategy')
    }
    const message =`${advice?.nameOfUnderlying} ${
      advice.strategy[0]?.expiry === null
        ? ""
        : advice.strategy[0]?.expiry
    } ${advice.strategy[0]?.strike === null?'':advice.strategy[0]?.strike} ${
      advice.strategy[0]?.optionType === null?'':advice.strategy[0]?.optionType
    } Entry ${advice.entryLowerRange} - ${
      advice.entryUpperRange
    } SL${advice.stopLoss} Target ${advice?.target1?advice?.target1:""} - ${
      advice?.target2?advice?.target2:''
    } - ${advice?.target3?advice?.target3:''}`
    await newnotificationModel.findOneAndUpdate({adviceId:id},{
      body:message
    })
    await chatModel.findOneAndUpdate({adviceId:id},{
      description:message
    })
    return res.status(200).send({message:'Advice updated Successfully'})
  } catch (e) {
    res.status(500).send({ message: "server error" });
  }
};
const updateAdvice = async (req, res, next) => {
  const updateBody = req.body;
  try {
    const advice = await AdviceModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { updates: updateBody },
        $set: { status: updateBody.newStatus },
      },
      { new: true }
    ).populate("instrumentId").populate("advisoryId").populate('strategy');
    const comboProduct = await ProductModel.find({
      relatedProductsIds: advice.advisoryId,
    })
      .select("_id")
      .lean();

    const productIds = [advice.advisoryId];
    const targetAudience = advice.notificationTitle;

    if (comboProduct.length) {
      comboProduct.forEach((product) => productIds.push(mongoose.Types.ObjectId(product._id)));
    }

    if (updateBody.notificationTitle && updateBody.notificationBody) {
      const typeOfNotification = new mongoose.Types.ObjectId(
        updateBody.typeOfNotification
      );
      // const insturmentName = advice.instrumentId?.name;
      // await notifyProduct(
      //   productIds,
      //   updateBody.notificationTitle,
      //   updateBody.notificationBody,
      //   updateBody.unSubNotificationTitle,
      //   updateBody.unSubNotificationBody,
      //   advice._id,
      //   targetAudience,
      //   typeOfNotification,
      //   insturmentName,
      //   next
      //   );
      const insturmentName = advice.instrumentId?.name;
      let whatsapp
      if(insturmentName === 'EQ'){
         whatsapp = {
          underlying: advice.nameOfUnderlying,
          body:updateBody.notificationBody,
          entry: `${advice.entryLowerRange} - ${advice.entryUpperRange}`,
          date:`${moment(advice.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`,
          cmp:`${updateBody.price}`,
          return: `${(((+updateBody.price-advice.entryLowerRange) / advice.entryLowerRange) * 100).toFixed(2)}%`,
          status: updateBody.newStatus,
          tradestatus:`${updateBody.newStatus === 'open' || updateBody.newStatus ==='bookPartialProfit'?'OPEN':'CLOSED'}`,
          instrument:insturmentName,
          update:true
        };
      }
      if (
        insturmentName === "OPTIDX" ||
        insturmentName === "OPTSTK" ||
        insturmentName === "FUTSTK" ||
        insturmentName === "FUTCOM" ||
        insturmentName === "FUTIDX"
      ) {
        whatsapp = {
          underlying: `${advice.nameOfUnderlying} ${advice.strategy[0]?.expiry === null ? "" :`${advice.strategy[0]?.expiry.split('-')[0]}-${advice.strategy[0]?.expiry.split('-')[1]}`} ${advice.strategy[0]?.strike === null ? "" : advice.strategy[0]?.strike} ${advice.strategy[0]?.optionType === null? "": advice.strategy[0]?.optionType}`,
          body:updateBody.notificationBody,
          entry: `${advice.entryLowerRange} - ${advice.entryUpperRange}`,
          lotsize:`${advice.strategy[0]?.minQty}`,
          date:`${moment(advice.createdAt)
            .tz("Asia/Kolkata")
            .format('MMM Do YY, h:mm:ss a')}`,
          cmp:`${updateBody.price}`,
          status: updateBody.newStatus ==='bookPartialProfit'?'Book Partial Profit':updateBody.newStatus,
          tradestatus:`${updateBody.newStatus === 'open' || updateBody.newStatus ==='bookPartialProfit'?'OPEN':'CLOSED'}`,
          instrument:insturmentName,
          update:true
        };
      }
      await NotifyProduct(
        productIds,
        updateBody.notificationTitle,
        updateBody.notificationBody,
        updateBody.unSubNotificationTitle,
        updateBody.unSubNotificationBody,
        advice._id,
        targetAudience,
        typeOfNotification,
        advice.instrumentId._id,
        undefined,
        undefined,
        whatsapp,
        next
      );
    }
    const chatmessage = {
      messageTypeId: "65014f94337000118fe8ec05",
      messageType: "advice",
      title:   updateBody.notificationTitle,
      description:updateBody.notificationBody,
      adviceId:  advice._id,
      adviceType: advice.advisoryId.productTitle,
      productId: advice.advisoryId._id.toString(),
      productType:advice.advisoryId.productTitle,
      subscription: true,
    }
    createMessage(chatmessage)
    await updatebyiduserAdvicelist(updateBody,req.params.id)
    await updatebyidadviceAdminlist(updateBody,req.params.id)
    res.send({ message: "advice added successfully" });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const closeExpiredAdvices = async (req, res, next) => {
  const query = { status: { $nin: ["exit", "bookprofit"] } };
  const allOpenAdvices = await AdviceModel.find(query, null, {
    sort: { _id: -1 },
  });
  const updateBody = {
    remarks: "Expired",
    price: "",
    newStatus: "exit",
    notificationTitle: "Expiry Auto Closing",
    notificationBody: "This advice is Exited as the expiry is expiring",
  };
  if (allOpenAdvices && allOpenAdvices.length > 0) {
    try {
      await Promise.all(
        _.map(allOpenAdvices, async (openAdvice) => {
          if (openAdvice.strategy.length > 0 && openAdvice.strategy[0].expiry) {
            let date;
            const instrument = openAdvice.instrumentId;
            if (instrument.hasExpiry && instrument.hasStrikePrice) {
              // Options
              date = moment(openAdvice.strategy[0].expiry, "DD-MMM-YYYY");
            } else if (instrument.hasExpiry && !instrument.hasStrikePrice) {
              // Futures
              const expiry = openAdvice.strategy[0].expiry;
              date = moment(`${expiry} ${moment().year()}`, "DDMMM YYYY");
            }
            if (date.isSameOrBefore()) {
              const advice = await AdviceModel.findOneAndUpdate(
                { _id: openAdvice._id },
                {
                  $push: { updates: updateBody },
                  $set: { status: updateBody.newStatus },
                },
                { new: true }
              );

              const comboProduct = await ProductModel.find({
                relatedProductsIds: advice.advisoryId,
              })
                .select("_id")
                .lean();

              const productIds = [advice.advisoryId];

              if (comboProduct.length) {
                comboProduct.forEach((product) => productIds.push(product._id));
              }
              return await NotifyProduct(
                productIds,
                updateBody.notificationTitle,
                updateBody.notificationBody,
                null,
                null,
                advice._id,
                updateBody.notificationTitle,
                null,
                null,
                undefined,
                undefined,
                next
              );
              //  notifyProduct(
              //   productIds,
              //   updateBody.notificationTitle,
              //   updateBody.notificationBody,
              //   null,
              //   null,
              //   advice._id,
              //   updateBody.notificationTitle,
              //   next
              // );
            }
            return undefined;
          }
        })
      );
      await sendService("Closed all expiry that has expired");
      return res.status(200).json({ success: true });
    } catch (e) {
      console.log(e);
      next(e);
    }
  } else {
    return res.status(200).json({ success: true, message: "Nothing to close" });
  }
};

const basket = async (req, res, next) => {
  const { id } = req.params;
  const { qty, broker } = req.query;
  let productQuantity = null;
  if (!isNaN(+qty)) {
    productQuantity = +qty;
  }
  if (!userRedirectionBroker[+broker]) {
    return next({ message: "No broker selected", status: 400 });
  }

  try {
    const advice = await AdviceModel.findById(id).lean();
    if (!advice) {
      return next({ message: "No advice found", status: 404 });
    }
    const trueDataSymbol = advice.strategy[0].trueDataSymbol;
    const { ltp } = await StockModel.findOne({ trueDataSymbol })
      .select("ltp")
      .lean();

    let basketItem;
    if (+broker === 0) {
      basketItem = {
        exchange: advice.instrumentId.hasExpiry ? "NFO" : "NSE",
        tradingsymbol: advice.strategy[0].kiteSymbol,
        quantity: productQuantity || advice.strategy[0].minQty,
        transaction_type: advice.action,
        order_type: advice.instrumentId.name === "OPTSTK" ? "LIMIT" : "MARKET",
        variety: "regular",
        readonly: false,
      };
      if (advice.instrumentId.name === "OPTSTK") {
        basketItem.price = addPercent(ltp, 1);
      }
    }

    if (+broker === 1) {
      basketItem = {
        exchange: advice.instrumentId.hasExpiry ? "NFO" : "NSE",
        tradingsymbol: advice.strategy[0].angelOneSymbol,
        quantity: productQuantity || advice.strategy[0].minQty,
        transactiontype: advice.action,
        ordertype: advice.instrumentId.name === "OPTSTK" ? "LIMIT" : "MARKET",
        variety: "regular",
        readonly: false,
      };
      if (advice.instrumentId.name === "OPTSTK") {
        basketItem.price = addPercent(ltp, 1);
      }
    }

    res.status(200).send([basketItem]);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const prefilledForm = async (req, res, next) => {
  const formID = req.params.id;
  try {
    const preform = await adviceformsModel.findById(formID);
    const productID = preform?.productId;
    const product = await productModel.findById(productID);
    const symbol = await symbolModel.find({
      instruments: { $in: [product.instrumentId._id] },
    });
    const expiry = await expiryDateModel
      .find({
        instruments: { $in: [product.instrumentId._id] },
        symbols: { $in: [symbol[0]._id] },
      })
      .sort({ expiryDate: 1 });
    const firstexpirydata = _.filter(expiry, (item) => {
      const date = moment(item.expiryDate, "YYYY-MM-DDTHH:mm:ss.SSSZ");
      return date.isSameOrAfter(moment(), "day");
    });
    let dataReceived = false;
    let optionsymbol = `${preform.nameOfUnderlying}-I`;
    getSymbolData([optionsymbol]);
    const listenerCallback = (data) => {
      if (!dataReceived && data.Symbol === optionsymbol) {
        dataReceived = true;
        let optionstrike = data.LTP - (data.LTP % 100);
        emitter.removeListener("livedata", listenerCallback);
        res.status(200).send({
          data: {
            productId: product?._id,
            marketId: product?.marketId?._id || "",
            exchangeId: product?.exchangeId?._id || "",
            productTypeId: product?.productTypeId?._id || "",
            timeFrameId: product?.timeFrameId?._id || "",
            volatilityId: product?.volatilityId?._id || "",
            hostProfileId: product?.hostProfileId?._id || "",
            instrumentId: product?.instrumentId?._id || "",
            notificationTitle: product?.productTitle || "",
            nameOfUnderlying: preform.nameOfUnderlying,
            nameOfUnderlyingDataId: preform.nameOfUnderlyingDataId,
            expiry: firstexpirydata[0]?.name,
            expiryDataId: firstexpirydata[0]?._id,
            optionStrike: optionstrike,
            // optionStrikeDataId: optionStrike[0]?._id,
            optionType: "CE",
            optionTypeDataId: "CE",
            preform,
          },
        });
        // res.status(200).send(data);
      }
    };
    emitter.on("livedata", listenerCallback);

    const timeout = setTimeout(() => {
      if (!dataReceived) {
        emitter.removeListener("livedata", listenerCallback);
        res
          .status(404)
          .send({ message: "No live data received for the specified symbol." });
      }
    }, 5000); // Adjust the timeout duration as needed

    // Clear the timeout if data is received before the timeout expires
    const clearTimeoutAndRemoveListener = () => {
      clearTimeout(timeout);
      emitter.removeListener("livedata", listenerCallback);
    };

    res.on("close", clearTimeoutAndRemoveListener);
    res.on("finish", clearTimeoutAndRemoveListener);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error." });
    console.log(error);
  }
};

const getUserAdvices = async (req, res, next) => {
  const perPage = parseInt(req.body.limit) || 10;
  const skip = parseInt(req.body.skip) || 0;
  const filterStatus = req.body.filterStatus;
  const filterProductId = req.body.productId ?? "";
  const subFilterId = req.body.filterProduct ?? "";
  const userId = res.locals.user._id;

  let matchFilters = [];

  let advisoryIdsArray = res.locals.user.subscribedAdvisories;

  try {
    const isSubscribedProduct =
      filterProductId === ""
        ? false
        : res.locals.user.subscribedAdvisories.some(
            (prod) =>
              prod._id.toString() ===
              mongoose.Types.ObjectId(filterProductId).toString()
          );

    const advisoryObjectIds =
      filterProductId === "" || !isSubscribedProduct
        ? advisoryIdsArray.map((adv) => {
            if (adv.relatedProductsIds.length === 0) {
              return adv._id;
            } else {
              console.log(`advice ids : ${adv.relatedProductsIds}`);

              return [...adv.relatedProductsIds];
            }
          })
        : await addingAdviciryIds(filterProductId);

    console.log(advisoryObjectIds);

    matchFilters.push({
      advisoryId: { $in: advisoryObjectIds.flat() },
    });
    if (filterStatus.length !== 0) {
      matchFilters.push({ status: { $in: filterStatus } });
    }

    const subscriptions = await Subscription.find({ userId: userId });

    if (subscriptions.length === 0) {
      return res.status(403).send({
        status: false,
        message: "You don't have any active subscription",
      });
    }

    const filterInBetweenRange = [];

    if (subFilterId != "") {
      subscriptions.forEach((sub) => {
        if (
          sub.advisoryId.toString() === filterProductId &&
          subFilterId != ""
        ) {
          filterInBetweenRange.push({
            $and: [
              { advisoryId: mongoose.Types.ObjectId(subFilterId) },
              {
                $or: [
                  { status: { $in: ["open", "freshTrade"] } },
                  {
                    createdAt: { $gte: sub.startTime, $lte: sub.endTime },
                  },
                ],
              },
            ],
          });
        }
      });
    } else {
      subscriptions.forEach((sub) => {
        filterInBetweenRange.push({
          $or: [
            { status: { $in: ["open", "freshTrade"] } },
            { createdAt: { $gte: sub.startTime, $lte: sub.endTime } },
          ],
        });
      });
    }

    const pipeline = [];

    console.log(pipeline.length === 0);

    pipeline.push({
      $match: {
        $and: matchFilters,
      },
    });

    if (filterInBetweenRange.length !== 0) {
      pipeline.push({
        $match: {
          $or: filterInBetweenRange,
        },
      });
    }

    pipeline.push({
      $lookup: {
        from: "strategies",
        localField: "strategy",
        foreignField: "_id",
        as: "strategy",
      },
    });

    pipeline.push({
      $lookup: {
        from: "producttypes",
        localField: "productTypeId",
        foreignField: "_id",
        as: "productDetails",
      },
    });

    pipeline.push({
      $unwind: "$productDetails",
    });

    pipeline.push({
      $lookup: {
        from: "instruments",
        localField: "instrumentId",
        foreignField: "_id",
        as: "instrumentDetails",
      },
    });

    pipeline.push({ $unwind: "$instrumentDetails" });

    pipeline.push({
      $project: {
        _id: 1,
        entryLowerRange: 1,
        entryUpperRange: 1,
        stopLoss: 1,
        target1: 1,
        target2: 1,
        target3: 1,
        action: 1,
        nameOfUnderlying: 1,
        holdingPeriod: 1,
        riskReward: 1,
        updatedAt: 1,
        createdAt: 1,
        status: 1,
        remarks: 1,
        strategy: 1,
        updates: 1,
        maxLoss: 1,
        maxProfit: 1,
        productType: "$productDetails.name",
        instrumentName: "$instrumentDetails.name",
      },
    });

    pipeline.push({
      $sort: { updatedAt: -1 },
    });

    pipeline.push({
      $skip: skip,
    });

    pipeline.push({
      $limit: perPage,
    });

    const advices = await AdviceModel.aggregate(pipeline);
    return res.status(200).send({
      status: true,
      count: advices.length,
      message: "Success",
      data: advices,
    });
  } catch (error) {
    console.log(error);
    next();
  }
};
const getSymbolliveData = async (req, res, next) => {
  const symbol = req.params.id;

  try {
    // let dataReceived = false;
    console.log(symbol)
   const stockrate = await getliveStockRate(symbol);
   if(stockrate){
    res.status(200).send({stockrate});
   }else{
    res.status(400).send({message:'Not found'});
   }
    // const listenerCallback = (data) => {
    //   if (!dataReceived && data.Symbol === symbol) {
    //     dataReceived = true;
    //     emitter.removeListener("livedata", listenerCallback);
    //     res.status(200).send(data);
    //   }
    // };

    // emitter.on("livedata", listenerCallback);

    // // You might need to add some timeout logic to handle scenarios where the event doesn't occur
    // const timeout = setTimeout(() => {
    //   if (!dataReceived) {
    //     emitter.removeListener("livedata", listenerCallback);
    //     res
    //       .status(404)
    //       .send({ message: "No live data received for the specified symbol." });
    //   }
    // }, 5000); // Adjust the timeout duration as needed

    // // Clear the timeout if data is received before the timeout expires
    // const clearTimeoutAndRemoveListener = () => {
    //   clearTimeout(timeout);
    //   emitter.removeListener("livedata", listenerCallback);
    // };

    // res.on("close", clearTimeoutAndRemoveListener);
    // res.on("finish", clearTimeoutAndRemoveListener);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error." });
  }
};

async function getAdviceFilter(req, res, next) {
  const filterProductId = req.body.productId ?? "";
  if (filterProductId !== "") {
    var subscribedAdvisories = res.locals.user.subscribedAdvisories;
    if (subscribedAdvisories.length === 0) {
      console.log("user don't have a active subscription");
    } else {
      subscribedAdvisories.forEach((element) => {
        var productId = element.relatedProductsIds;
        productId.forEach((ele) => {
          if (ele.toString() === filterProductId) {
            req.body.productId = element._id.toString();
            req.body.filterProduct = filterProductId;
            console.log(req.body.productId);
            console.log("product id match");
          } else {
            console.log("product id not match");
          }
        });
        console.log(`user element : ${element.relatedProductsIds}`);
      });
    }
  }
  next();
}

const getliveOptionChain = async(req,res,next)=>{
  const nameOfUnderlying = req.query.nameOfUnderlying
  const expiry = req.query.expiry
  const interval = req.query.interval
  try {
    const OptionChain = await getLiveOptionChain(nameOfUnderlying,expiry)
    const lines = OptionChain.split('\n');

    // Extract the headers
    const headerLine = lines[0];
    const headerValues = headerLine.split(',')

    // Extract the data
    const dataLines = lines.slice(1);
    const dataValues = dataLines.map((line) => {
      return line.split(',')
    });
    const optionChainData = dataValues.map((rowData) => {
      const obj = {};
      for (let i = 0; i < headerValues.length; i++) {
        obj[headerValues[i]] = rowData[i];
      }
      return obj;
    });
    const liverate = await getliveStockRate(`${nameOfUnderlying}-I`)
    const atm = liverate?.ltp - (liverate?.ltp % 100);
    let filterOptionchain
    let strikediff=10
    if(nameOfUnderlying === 'NIFTY'||nameOfUnderlying === 'FINNIFTY'){
      strikediff = 50
    }
    if(nameOfUnderlying === 'BANKNIFTY'){
      strikediff = 100
    }
    if(nameOfUnderlying === 'MIDCPNIFTY'){
      strikediff = 25
    }
    const lowrange = atm -interval*strikediff
    const highrange = atm + interval*strikediff
    filterOptionchain = optionChainData.filter((range)=>+range.strike >= lowrange && +range.strike <= highrange)
    // .map((x,i)=>{return {[headerValues[i]]:x}})
    if(OptionChain){
      res.status(200).send({item:filterOptionchain})
    }else {
      res.status(400).send({Message:'NOT FOUND'})
    }
  } catch (error) {
    
  }
}
module.exports = {
  adviceGrid,
  updateAdvice,
  closeExpiredAdvices,
  basket,
  updateAdviceData,
  prefilledForm,
  getUserAdvices: getUserAdvices,
  getAdviceFilter: getAdviceFilter,
  getSymbolliveData,
  adminAdvicelist,
  getCountStatusandProduct,
  updatebyidadviceAdminlist,
  userAdvicelist,
  getliveOptionChain
};

async function addingAdviciryIds(filterProductId) {
  try {
    const product = await productModel.findById(filterProductId);
    if (product.relatedProductsIds.length === 0) {
      return [mongoose.Types.ObjectId(filterProductId)];
    } else {
      console.log(`related product ids : ${[...product.relatedProductsIds]}`);
      return product.relatedProductsIds.map((a) => mongoose.Types.ObjectId(a));
    }
  } catch (error) {
    return [];
  }
}
