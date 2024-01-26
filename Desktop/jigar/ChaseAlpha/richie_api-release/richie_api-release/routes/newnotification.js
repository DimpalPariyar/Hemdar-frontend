const express = require("express");
const router = express.Router();
const newnotificationController = require("../controller/newnotification.controller");
const checkAuth = require("../utils/checkAuth");
const constructQuery = require("../middlewares/constructQuery");

router.post("/", checkAuth.hasSuperAdminPermission, (req, res, next) =>
  newnotificationController.Notify(req, res, next)
);
router.post("/everyone", checkAuth.hasSuperAdminPermission, (req, res, next) =>
  newnotificationController.NotifyEveryone(req, res, next)
);

router.get(
  "/",
  checkAuth.hasSuperAdminPermission,
  constructQuery(),
  (req, res, next) =>
    newnotificationController.getAllAdminnotification(req, res, next)
);

router.post(
  "/user-notifications",
  checkAuth.hasUserPermission,
  newnotificationController.getUserNotifications
);
router.post(
  "/advice-notifications",
  checkAuth.hasUserPermission,
  newnotificationController.getAdviceNotifications
);
router.get(
  "/user-notifications/count",
  checkAuth.hasUserPermission,
  newnotificationController.getNotificationsCount
);
router.get(
  "/user-notifications/updateAll",
  checkAuth.hasUserPermission,
  newnotificationController.updateAll
);
router.put(
  "/user-notifications/:notificationId",
  checkAuth.hasUserPermission,
  newnotificationController.updateUserNotificationStatus
);
router.get("/migration", (req, res, next) =>
  newnotificationController.adminlistdatamigration(req, res, next)
);
module.exports = router;
