require("dotenv").config();
const multer = require("multer");
const AWS = require("aws-sdk");

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, "");
  },
});

const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
  if (file.mimetype !== null) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECERT_ACCESS_KEY,
});

module.exports = {
  s3,
  upload,
};
