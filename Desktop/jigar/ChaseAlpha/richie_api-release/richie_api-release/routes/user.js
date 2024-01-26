const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const refreshTokenController = require('../controller/refreshToken.controller');
const userBrokerController = require('../controller/userBroker.controller');
const checkAuth = require('../utils/checkAuth');
const { check } = require('express-validator');
const constructQuery = require('../middlewares/constructQuery');
const checkValidId = require('../middlewares/checkValidId');
const BrokerModel = require('../model/broker.model');
const {
  checkMultiBroker,
  checkDuplicateBroker,
} = require('../middlewares/checkMultiBroker');
const { createKiteAccessToken } = require('../middlewares/Kite');
const billingController = require('../controller/billing.controller');
const deleteAccountController = require('../controller/deleteAccount.controller');

router.get('/gender', (req, res, next) =>
  userController.userGenderTypes(req, res, next)
);
router.get('/redirectionBroker', (req, res, next) =>
  userController.redirectionBrokerTypes(req, res, next)
);
router.get('/status', (req, res, next) =>
  userController.userStatusTypes(req, res, next)
);
router.get('/residential', (req, res, next) =>
  userController.userResidentialTypes(req, res, next)
);
router.get('/', checkAuth.hasUserPermission, (req, res, next) =>
  userController.getUser(req, res, next)
);
router.delete(
  '/',
  checkAuth.hasUserPermission,
  deleteAccountController.deleteAccountRequest
);
router.get('/risk', checkAuth.hasUserPermission, (req, res, next) =>
  userController.getUserRiskProfile(req, res, next)
);
router.put(
  '/verify/name',
  checkAuth.hasUserPermission,
  check('panNumber', 'Please enter a valid pan number')
    .escape()
    .exists({ checkFalsy: true })
    .isLength({ min: 10, max: 10 })
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]$/),
  check(
    'name',
    'Please send the name that the verify Pan API gave confirming with the user'
  )
    .escape()
    .exists({ checkFalsy: true }),
  (req, res, next) => userController.confirmName(req, res, next)
);
router.put('/details', checkAuth.hasUserPermission, (req, res, next) =>
  userController.updateDetails(req, res, next)
);
router.put(
  '/verify',
  [checkAuth.isAlreadyExist, checkAuth.hasUserPermission],
  (req, res, next) => userController.verifyDetails(req, res, next)
);
router.post('/refresh', check('refreshToken').exists(), (req, res, next) =>
  refreshTokenController.refreshToken(req, res, next)
);
router.post('/revoke', check('refreshToken').exists(), (req, res, next) =>
  refreshTokenController.revokeToken(req, res, next)
);

router.get(
  '/billing/gst',
  [checkAuth.hasUserPermission],
  billingController.getGSTDetails
);

router.get(
  '/subscriptions',
  checkAuth.hasUserPermission,
  constructQuery(),
  (req, res, next) => userController.getSubscriptions(req, res, next)
);
router.get(
  '/orders',
  checkAuth.hasUserPermission,
  constructQuery(),
  (req, res, next) => userController.getOrders(req, res, next)
);
router.get('/order/:id',
   checkAuth.hasUserPermission,
   constructQuery(),
   (req,res,next)=>userController.getSingleOrderDetails(req,res,next)
)
router.post(
  '/broker',
  checkAuth.hasUserPermission,
  check('broker', 'Please provide a broker').isLength({ min: 1 }).trim(),
  check('clientId', 'Please provide a client id').isLength({ min: 1 }).trim(),
  check('apiKey', 'Please provide a api key').isLength({ min: 1 }).trim(),
  check('apiSecret', 'Please provide a api secret').isLength({ min: 1 }).trim(),
  checkValidId(BrokerModel, 'broker'),
  checkMultiBroker,
  checkDuplicateBroker,
  userBrokerController.addBroker
);
router.get(
  '/broker',
  checkAuth.hasUserPermission,
  userBrokerController.getBroker
);
router.get(
  '/broker/requestToken',
  checkAuth.hasUserPermission,
  userBrokerController.getBrokerRequestToken
);
router.get(
  '/broker/:id',
  checkAuth.hasUserPermission,
  userBrokerController.getSingleBroker
);
router.patch(
  '/broker/:id',
  checkAuth.hasUserPermission,
  check('active', 'Please provide broker status').isBoolean().optional(),
  check('clientId', 'Please provide a client id')
    .isLength({ min: 1 })
    .trim()
    .optional(),
  check('apiKey', 'Please provide a api key')
    .isLength({ min: 1 })
    .trim()
    .optional(),
  check('apiSecret', 'Please provide a api secret')
    .isLength({ min: 1 })
    .trim()
    .optional(),
  check('requestToken', 'Please provide a request token')
    .isLength({ min: 1 })
    .trim()
    .optional(),
  createKiteAccessToken,
  userBrokerController.updateBroker
);

router.get('/notification-settings', checkAuth.hasUserPermission, userController.getGenralNotifications)
router.post('/notification-settings', checkAuth.hasUserPermission, userController.updateGenralNotifications)
router.get('/customNotifications', checkAuth.hasUserPermission, userController.getCustomNotifications)
router.post('/customNotifications', checkAuth.hasUserPermission, userController.updateCustomNotifications)
router.delete(
  '/broker/:id',
  checkAuth.hasUserPermission,
  userBrokerController.deleteBroker
);
router.get('/zerodhaprofile/:id',checkAuth.hasUserPermission,(req,res,next)=>userController.getZerodhaProfile(req,res,next))
router.post('/zerodhaplaceorder',checkAuth.hasUserPermission,(req,res,next)=>userController.placeTradeOrderonZerodha(req,res,next))
router.delete('/logout', checkAuth.hasUserPermission, userController.logout);
router.post('/updatecustomarray',(req,res,next)=>userController.udpateCustomarray(req,res,next))
router.get('/whatsappMsg',constructQuery(),(req,res,next)=>userController.listofUserWhatsappMsg(req,res,next))
module.exports = router;
