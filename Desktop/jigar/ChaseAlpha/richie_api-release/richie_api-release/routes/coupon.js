const express = require('express')
const router = express.Router()
const checkAuth = require('../utils/checkAuth');
const CouponController = require('../controller/coupon.controller')

router.post('/',checkAuth.hasSuperAdminPermission,(req,res,next)=>CouponController.CreateCoupon(req,res,next))
router.get('/',checkAuth.hasUserPermission || checkAuth.hasSuperAdminPermission ,(req,res,next)=>CouponController.getUserCoupon(req,res,next))
router.get('/:id',checkAuth.hasSuperAdminPermission,(req,res,next)=>CouponController.getSingleCoupon(req,res,next))
router.patch('/:id',checkAuth.hasSuperAdminPermission,(req,res,next)=>CouponController.UpdateCoupon(req,res,next))
router.post('/apply-coupon',checkAuth.hasUserPermission,(req,res,next)=>{CouponController.ApplyCoupon(req,res,next)})
router.post('/remove-coupon',checkAuth.hasUserPermission,(req,res,next)=>CouponController.RemoveCoupon(req,res,next))
router.get('/couponlist/admin',checkAuth.hasSuperAdminPermission,(req,res,next)=>CouponController.getAllCoupon(req,res,next))

module.exports = router
