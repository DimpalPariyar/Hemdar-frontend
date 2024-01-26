const express = require("express");
const checkAuth = require("../utils/checkAuth");
const {
  getChatMessages,
  postMessage,
  getAllChatmessage,
} = require("../controller/chat.controller");

const router = express.Router();

router.post("/messages", checkAuth.hasUserPermission, getChatMessages);
router.post(
  "/user-messages",
  checkAuth.hasReasearchAdminPermission ||
    checkAuth.hasSuperAdminPermission,
  postMessage
);
router.get("/allchat", getAllChatmessage);

module.exports = router;
