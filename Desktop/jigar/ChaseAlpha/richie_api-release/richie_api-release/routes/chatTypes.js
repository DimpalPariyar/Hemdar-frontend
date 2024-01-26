const express = require("express");
const checkAuth = require("../utils/checkAuth");
const {
  getAllTypes,
  createType,
} = require("../controller/chatTypes.controller");

const router = express.Router();

router.get("/message-types",checkAuth.hasReasearchAdminPermission || checkAuth.hasSuperAdminPermission, getAllTypes);
router.post("/message-types", createType);

module.exports = router;
