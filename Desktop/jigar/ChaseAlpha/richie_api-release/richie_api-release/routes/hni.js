const express = require('express')
const router = express.Router()
const HNIcontroller = require('../controller/hni.controller')
const checkAuth = require('../utils/checkAuth')
const crud = require('../controller/crud')
const HniForm = require('../model/hni.model')
router.use('/',crud(HniForm))

module.exports = router;
