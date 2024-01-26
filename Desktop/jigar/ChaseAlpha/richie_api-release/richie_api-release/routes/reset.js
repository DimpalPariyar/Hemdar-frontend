const express = require('express');
const router = express.Router();
const resetController = require("../controller/reset.controller");
const checkAuth = require("../utils/checkAuth");
const {check} = require("express-validator");
const adminController = require("../controller/admin.controller");

router.post('/', (req, res, next) => resetController.reset(req, res, next));

router.put("/admin/permissions", check("type", "Please provide valid type of roles for creating admin").isArray({
    min: 1, max: 4
}).custom(types => {
    return types.every((type) => {
        return type >= 1 && type <= 4;
    })
}), (req, res, next) => adminController.changePermissions(req, res, next));

router.post("/notify", (req, res, next)=> resetController.testNotification(req, res, next));

router.post("/dcoument", (req, res, next) => resetController.changeOrderDocumentId(req, res, next));
router.post("/slack/hello", (req, res, next) => resetController.notifySlack(req, res, next));

module.exports = router;
