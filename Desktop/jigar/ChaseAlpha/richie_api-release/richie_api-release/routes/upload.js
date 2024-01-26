const express = require('express');
const uploadController = require("../controller/upload.controller");
const {downloadDocument} = require("../service/digio_service")
const {upload} = require("../service/aws_file_upload");
const router = express.Router();
const constructQuery = require('../middlewares/constructQuery');

/* GET home page. */
router.post('/', upload.single('image'), (req, res, next) => uploadController.uploadFile(req, res, next));

router.get('/digio-document/:id',constructQuery(),(req,res,next)=> downloadDocument(res,req,next))
module.exports = router;
