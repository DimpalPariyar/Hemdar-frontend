const express = require('express');
const router = express.Router();
const crud = require("../controller/crud");
const Topic = require("../model/topic.model");
const Article = require("../model/article.model");
const insertRelationData = require("../middlewares/insertRelationData");

router.use('/', [insertRelationData(Article, "articles", "articles"), crud(Topic)]);



module.exports = router;
