const express = require('express');
const router = express.Router();
const checkAuth = require('../utils/checkAuth');
const enroll = require('../controller/enroll.controller');
const SuperCourseModel = require('../model/superCourse.model');
const CartModel = require('../model/cart.model');
const checkValidId = require('../middlewares/checkValidId');

router.post(
  '/course',
  [checkAuth.hasUserPermission, checkValidId(SuperCourseModel, 'id')],
  (req, res, next) => enroll.superCourse(req, res, next)
);

router.post(
  '/advisory',
  [checkAuth.hasUserPermission, checkValidId(CartModel, 'id')],
  (req, res, next) => enroll.advisory(req, res, next)
);

module.exports = router;
