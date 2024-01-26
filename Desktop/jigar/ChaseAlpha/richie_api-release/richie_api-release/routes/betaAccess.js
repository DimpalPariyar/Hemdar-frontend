const express = require('express');
const router = express.Router();
const checkAuth = require('../utils/checkAuth');
const constructQuery = require('../middlewares/constructQuery');
const betaAccessController = require('../controller/betaAccess.controller');
const { check } = require('express-validator');

router.post(
  '/register',
  checkAuth.hasSuperAdminPermission,
  check('email', 'Please enter a valid email').isEmail(),
  check('firstName', 'Please enter a valid firstName').isLength({ min: 1 }),
  check('lastName', 'Please enter a valid lastName').isLength({ min: 1 }),
  check('mobile', 'Please enter a valid mobile number').isLength({
    min: 10,
    max: 10,
  }),
  check('tradingCapital', 'Please enter a valid tradingCapital').isLength({
    min: 1,
  }),
  check('device', 'Please enter a valid device').isLength({
    min: 1,
  }),
  check('interests', 'Please provide interests').isArray({
    min: 1,
  }),
  check('brokerAccounts', 'Please provide brokerAccounts').isArray({
    min: 1,
  }),
  betaAccessController.registerForAccess
);
router.get(
  '/',
  checkAuth.hasSuperAdminPermission,
  constructQuery(),
  betaAccessController.getAllRegisteredUsers
);
router.get(
  '/updateEntries',
  checkAuth.hasSuperAdminPermission,
  betaAccessController.updateBetaAccessEntries
);
router.patch(
  '/bulk',
  checkAuth.hasSuperAdminPermission,
  betaAccessController.bulkAccess
);
router.patch(
  '/:id',
  checkAuth.hasSuperAdminPermission,
  check('enable', 'Please provide status').isBoolean(),
  betaAccessController.updateUserBetaAccess
);
router.delete(
  '/:id',
  checkAuth.hasSuperAdminPermission,
  betaAccessController.deleteBetaAccess
);

module.exports = router;
