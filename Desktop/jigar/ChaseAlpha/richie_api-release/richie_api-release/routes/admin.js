const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const checkAuth = require('../utils/checkAuth');
const { check } = require('express-validator');
const refreshTokenController = require('../controller/refreshToken.controller');
const constructQuery = require('../middlewares/constructQuery');

router.get('/userRights', checkAuth.hasSuperAdminPermission, (req, res, next) =>
  adminController.userRights(req, res, next)
);

router.put(
  '/permissions',
  [
    checkAuth.hasSuperAdminPermission,
    check('type', 'Please provide valid type of roles for creating admin')
      .isArray({
        min: 0,
        max: 8,
      })
      .custom((types) => {
        return types.every((type) => {
          return type >= 0 && type <= 8;
        });
      }),
  ],
  (req, res, next) => adminController.changePermissions(req, res, next)
);
router.put(
  '/researchaccess',
    checkAuth.hasSuperAdminPermission,
    (req,res,next)=> adminController.changeResearchUserAcess(req,res,next)
  
)
router.delete(
  '/delete',
  checkAuth.hasSuperAdminPermission,
  adminController.deleteAccount
);
router.put('/ban', checkAuth.hasSuperAdminPermission, (req, res, next) =>
  adminController.banAdmin(req, res, next)
);

router.post(
  '/signup',
  [
    checkAuth.hasSuperAdminPermission,
    checkAuth.isAlreadyExist,
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a valid password').isLength({ min: 1 }),
    check('type', 'Please provide valid type of roles for creating admin')
      .isArray({
        min: 0,
        max: 8,
      })
      .custom((types) => {
        return types.every((type) => {
          return type >= 0 && type <= 8;
        });
      }),
  ],
  (req, res, next) => adminController.signUp(req, res, next)
);

router.put(
  '/password',
  checkAuth.hasSuperAdminPermission,
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter a valid password').isLength({ min: 1 }),
  (req, res, next) => adminController.changePassword(req, res, next)
);

router.post(
  '/login',
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter a valid password').isLength({ min: 1 }),
  (req, res, next) => adminController.login(req, res, next)
);

router.get('/me', checkAuth.isValid, (req, res, next) =>
  adminController.me(req, res, next)
);

router.get('/list', checkAuth.hasSuperAdminPermission, (req, res, next) =>
  adminController.listAdmins(req, res, next)
);
router.get('/researchlist',checkAuth.hasSuperAdminPermission,(req,res,next) =>{
  adminController.listOfResearchs(req,res,next)
})

router.post(
  '/getUserdetail',
  (req, res, next) => adminController.getUserDetails(req, res, next)
);
router.get(
  '/users/lists',
  checkAuth.hasSuperAdminPermission,
  constructQuery(),
  (req, res, next) => adminController.listOfUsers(req, res, next)
);
router.get(
  '/usersemail/lists',
  checkAuth.hasSuperAdminPermission,
  (req, res, next) => adminController.listofUsersEmail(req, res, next)
);
router.get(
  '/users/list/:id',
  checkAuth.hasSuperAdminPermission,
  constructQuery(),
  (req, res, next) => adminController.listUsers(req, res, next)
);


router.put(
  '/user/advisory',
  checkAuth.hasSuperAdminPermission,
  (req, res, next) => adminController.updateSubscribedAdvisories(req, res, next)
);
router.get(
  '/user/advisory',
  checkAuth.hasSuperAdminPermission,
  (req, res, next) => adminController.getSubscribedAdvisories(req, res, next)
);
router.put(
  '/user/sessions',
  checkAuth.hasSuperAdminPermission,
  (req, res, next) => adminController.updatePurchasedSessions(req, res, next)
);
router.get(
  '/user/sessions',
  checkAuth.hasSuperAdminPermission,
  (req, res, next) => adminController.getPurchasedSessions(req, res, next)
);

router.get(
  '/session/users',
  checkAuth.hasSuperAdminPermission,
  (req, res, next) => adminController.listUsersSessions(req, res, next)
);

router.post('/refresh', check('refreshToken').exists(), (req, res, next) =>
  refreshTokenController.refreshToken(req, res, next)
);

router.post('/revoke', check('refreshToken').exists(), (req, res, next) =>
  refreshTokenController.revokeToken(req, res, next)
);

router.get(
  '/orders',
  checkAuth.hasSuperAdminPermission,
  constructQuery(),
  (req, res, next) => adminController.getOrders(req, res, next)
);
router.get(
  '/notification',
  // checkAuth.hasSuperAdminPermission,
  constructQuery(),
  (req, res, next) => adminController.getNotifications(req, res, next)
);

router.post('/createorder', (req, res, next) =>
  adminController.createOrder(req, res, next)
);
router.get(
  '/orders/:id',
  checkAuth.hasSuperAdminPermission,
  constructQuery(),
  adminController.getSingleOrder
);
router.put(
  '/orders/:id',
  checkAuth.hasSuperAdminPermission,
  constructQuery(),
  adminController.UpdateOrder
);
router.get('/sales-report',checkAuth.hasSuperAdminPermission,
 constructQuery(),
 adminController.GenerateSaleReport
)
router.get('/sales-report/attemptedorders',checkAuth.hasSuperAdminPermission,
constructQuery(),
adminController.attemptedSalesreport
)
// router.get(
//   '/subscriptions',
//   checkAuth.hasSuperAdminPermission,
//   constructQuery(),
//   (req, res, next) => adminController.getSubscriptions(req, res, next)
// );
router.get(
  '/subscriptions',
  // checkAuth.hasSuperAdminPermission,
  constructQuery(),
  (req, res, next) => adminController.getSubscriptions(req, res, next)
);
router.get(
  '/sync-subscriptions/:id',
  // checkAuth.hasSuperAdminPermission,
  // constructQuery(),
  (req, res, next) => adminController.syncUserSubscription(req, res, next)
);
router.get(
  '/ProductSubCount',
  (req,res,next) => {
    adminController.getProductSubCount(req,res,next)
  }
)
router.get(
  '/collection',
  checkAuth.hasSuperAdminPermission,
  adminController.getCollections
);
router.delete(
  '/collection',
  checkAuth.hasSuperAdminPermission,
  adminController.clearCollections
);

router.delete('/logout', checkAuth.isValid, adminController.logout);
router.delete(
  '/userLogout',
  checkAuth.hasSupportPermission,
  adminController.logoutUserDevice
);

router.post(
  '/user',
  checkAuth.hasSupportPermission,
  adminController.createUser
);
router.get('/updategstno', checkAuth.hasSuperAdminPermission,adminController.UpdateGstNo
)
router.get('/sync-subscription',checkAuth.hasSuperAdminPermission,(req,res,next)=>adminController.syncscbscriptioncollection(req,res,next))
router.get('/ckyc',checkAuth.hasSuperAdminPermission,(req,res,next)=>adminController.ckycBulkStorebackdated(req,res,next))
router.get('/user-ckyc/:id',checkAuth.hasSuperAdminPermission,(req,res,next)=>adminController.userCkycdata(req,res,next))
router.get('/whatsapp',(req,res,next)=>adminController.sendSms(req,res,next))
router.get('/cybersecurityupdates',(req,res,next)=>adminController.sendEmailforCyberSecurityUpdates(req,res,next))
router.post('/onetooneWhatsapp',(req,res,next)=>adminController.OnetoOneWhatsappMsg(req,res,next))
module.exports = router;
