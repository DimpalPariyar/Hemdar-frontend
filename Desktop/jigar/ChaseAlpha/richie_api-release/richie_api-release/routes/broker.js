const express = require('express');
const checkAuth = require('../utils/checkAuth');
const router = express.Router();
const { check } = require('express-validator');
const brokerController = require('../controller/broker.controller');

router.get('/', checkAuth.isValid, brokerController.getBrokers);
router.post(
  '/',
  checkAuth.hasSuperAdminPermission,
  check('name', 'Please provide a broker name').isLength({ min: 1 }).trim(),
  brokerController.addBroker
);
router.patch(
  '/:id',
  checkAuth.hasSuperAdminPermission,
  check('name', 'Please provide a broker name')
    .isLength({ min: 1 })
    .trim()
    .optional(),
  brokerController.updateBroker
);
router.delete(
  '/:id',
  checkAuth.hasSuperAdminPermission,
  brokerController.deleteBroker
);


module.exports = router;
