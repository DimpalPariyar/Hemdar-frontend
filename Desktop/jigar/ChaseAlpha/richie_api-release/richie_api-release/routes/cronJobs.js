const express = require('express');
const router = express.Router();
const {downloadLatestCopy} = require("../controller/cronJobs.controller");
const {closeExpiredAdvices} = require("../controller/advice.controller");

router.post('/fetch-new-bhavcopy', (req, res, next) => downloadLatestCopy(req, res, next));
router.post('/close-expired-advices', (req, res, next) => closeExpiredAdvices(req, res, next));

module.exports = router;