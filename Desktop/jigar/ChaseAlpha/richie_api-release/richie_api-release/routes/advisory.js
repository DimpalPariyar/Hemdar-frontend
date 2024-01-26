const express = require('express');
const crud = require('../controller/crud');
const checkHasValidIds = require('../middlewares/checkHasValidIds');
const checkValidId = require('../middlewares/checkValidId');
const insertRelationData = require('../middlewares/insertRelationData');
const adviceClean = require('../middlewares/adviceClean');
const constructQuery = require('../middlewares/constructQuery');
const searchQuery = require('../middlewares/searchQuery');
const {
  purchased,
  onlyPurchased,
  sortOrder,
  addRelatedProducts,
} = require('../middlewares/filterQuery');
const product = require('../model/product.model');
const Cart = require('../model/cart.model');
const { PriceModel } = require('../model/price.model');
const host = require('../model/hostProfile.model');
const {
  market,
  instrument,
  exchange,
  timeFrame,
  productType,
  volatility,
  adviceStatus,
} = require('../model/genericSingleValue.model');
const checkAuth = require('../utils/checkAuth');
const Product = require('../model/product.model');
const advisory = require('../controller/advisory.controller');
const advice = require('../controller/advice.controller');
const { createRazorPayPlans } = require('../service/razorpay_service');
const { check } = require('express-validator');
const strategy = require('../model/strategy.model');
const AdviceModel = require('../model/advice.model');
const Subscription = require('../model/subscriptionOrder.model');
const SymbolModel = require('../model/symbol.model');
const ExpiryDateModel = require('../model/expiryDate.model');
const StrikePriceModel = require('../model/strikePrice.model');
const AdvicePrefilledForm = require('../model/adviceforms.model');
const { getProducts, getSingleProduct } = require('../controller/product.controller');
const router = express.Router();

router.use('/exchange', crud(exchange));
router.use('/product-type', crud(productType));
router.use('/market', crud(market));
router.use('/instrument', crud(instrument));
router.use('/time-frame', crud(timeFrame));
router.use('/volatility', crud(volatility));
router.use('/advice-status', crud(adviceStatus));
router.use('/symbol', constructQuery(), searchQuery('name'), crud(SymbolModel));
router.use(
  '/expiry-date',
  constructQuery(),
  searchQuery('name'),
  sortOrder('expiryDate'),
  crud(ExpiryDateModel)
);
router.use(
  '/strike-price',
  constructQuery(),
  searchQuery('name'),
  crud(StrikePriceModel)
);

router.post(
  '/cart',
  [
    checkAuth.hasUserPermission,
    checkValidId(Product, 'id'),
    check('isESignMandatory', 'Please tell is it mandatory e-sign or not')
      .isBoolean()
      .toBoolean(),
  ],
  (req, res, next) => advisory.addToCart(req, res, next)
);
router.post(
  '/unsubscribe',
  [
    checkAuth.hasUserPermission,
    checkValidId(Subscription, 'id'),
    check(
      'cancelAtCycleEnd',
      'Please tell Subscription has to be cancelled immediately or at end of this subscription cycle'
    )
      .isBoolean()
      .toBoolean(),
  ],
  (req, res, next) => advisory.cancelSubs(req, res, next)
);

router.post(
  '/esign',
  [
    checkAuth.hasUserPermission,
    checkValidId(Cart, 'id'),
    check('identifier').isIn(['mobile', 'email']),
  ],
  (req, res, next) => advisory.eSign(req, res, next)
);
router.post(
  '/principle/esign',
  [checkAuth.hasUserPermission],
  advisory.principleESign
);

router.use('/product', [
  checkAuth.isValid,
  checkValidId(exchange, 'exchangeId'),
  checkValidId(productType, 'productTypeId'),
  checkValidId(market, 'marketId'),
  checkValidId(timeFrame, 'timeFrameId'),
  checkValidId(instrument, 'instrumentId'),
  checkValidId(volatility, 'volatilityId'),
  checkValidId(host, 'hostProfileId'),
  checkHasValidIds(product, 'relatedProductsIds'),
  insertRelationData(PriceModel, 'subscriptionPlanIds', 'subscriptionPlanIds'),
  constructQuery(),
  purchased('_id', 'subscribedAdvisories'),
  searchQuery('productTitle', 'productShortDescription'),
  crud(product),
]);

router.get('/products',checkAuth.isValid, getProducts)
router.get("/products/:productId", checkAuth.isValid, getSingleProduct);

// router.post("/user-advices", checkAuth.isValid, advice.getAdviceFilter, advice.getUserAdvices)
router.post("/user-advices", checkAuth.isValid,(req,res,next)=>advice.userAdvicelist(req,res,next))
router.use('/advice', [
  checkAuth.isValid,
  checkValidId(Product, 'advisoryId'),
  adviceClean(),
  insertRelationData(strategy, 'strategy', 'strategy'),
  // constructQuery(),
  addRelatedProducts('_id', 'subscribedAdvisories', 'advisoryId', Product),
  crud(AdviceModel),
]);

router.get('/advice-grid', [checkAuth.isValid,constructQuery()], (req, res, next) =>
  advice.adminAdvicelist(req, res, next)
);
router.get('/productcount',(req,res,next)=>advice.getCountStatusandProduct(req,res,next))
router.get('/basket/:id', advice.basket);
router.put('/advice-grid/:id', advice.updateAdvice);
router.patch('/advice-update/:id',checkAuth.hasSuperAdminPermission, constructQuery(),(req,res,next)=>advice.updateAdviceData(req,res,next))
router.get('/form/:id',checkAuth.hasSuperAdminPermission,(req,res,next)=>advice.prefilledForm(req,res,next))
router.use('/prefilled-form',checkAuth.hasSuperAdminPermission,constructQuery(),searchQuery('name'),crud(AdvicePrefilledForm))
router.get('/stocksymbol/:id',checkAuth.hasSuperAdminPermission,(req,res,next)=>advice.getSymbolliveData(req,res,next))
router.get('/optionchain',(req,res,next)=>advice.getliveOptionChain(req,res,next))
module.exports = router;
