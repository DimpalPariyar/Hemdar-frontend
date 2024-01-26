const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: `Richie Chasealpha Backend API is running on ${process.env.NODE_ENV} environment`,
  });
});

module.exports = router;
