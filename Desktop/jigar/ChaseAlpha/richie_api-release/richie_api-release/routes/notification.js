const express = require('express');
const checkAuth = require("../utils/checkAuth");
const notificationController = require("../controller/notification.controller");
const constructQuery = require('../middlewares/constructQuery');
const router = express.Router();

router.post('/',
//  checkAuth.hasSuperAdminPermission,
  (req, res, next) => notificationController.notify(req, res, next));
  
router.get('/',checkAuth.hasSuperAdminPermission, constructQuery(),(req,res,next)=>notificationController.getAllnotification(req,res,next))


router.get('/getall/types',constructQuery(),(req,res,next)=>notificationController.getAllTypeofNotification(req,res,next))
router.post('/create/types',checkAuth.hasSuperAdminPermission,(req,res,next)=>notificationController.createNotificaitonType(req,res,next))
router.post('/user-notifications',checkAuth.hasUserPermission, notificationController.getUserAllNotifications)
router.delete('/delete/:id',(req,res,next)=>notificationController.DeleteTypeofNotification(req,res,next))
router.patch('/update-readStatus/:id',checkAuth.hasUserPermission,(req,res,next)=>notificationController.UpdateReadStatus(req,res,next))
router.get('/unread-count/:id',checkAuth.hasUserPermission,(req,res,next)=>notificationController.getUnreadNotificationCount(req,res,next))
router.get('/updatemodel',checkAuth.hasSuperAdminPermission,(req,res,next)=>notificationController.updateNotificationModel(req,res,next))
module.exports = router;
