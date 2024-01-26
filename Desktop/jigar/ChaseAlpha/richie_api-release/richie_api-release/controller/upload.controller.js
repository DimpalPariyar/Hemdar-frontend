const { s3 } = require("../service/aws_file_upload");
require("dotenv").config();
const uploadFile = async (req, res, next) => {
  if (!req.file) {
    return next("FILE_MISSING");
  }
  const data = await uploadToS3(
    req.file.originalname,
    req.file.buffer,
    req.file.mimetype,
    next
  );
  return res.status(200).send({
    url: data,
    // url: req.file,
    success: true,
    message: "Image uploaded successfully",
  });
};

// const uploadToS3 = async (filename, bodyBuffer, contentType, next) => {

//     const params = {
//         Bucket: "richiestorage",      // bucket that we made earlier
//         Key: filename,               // Name of the image
//         Body: bodyBuffer,                    // Body which will contain the image in buffer format
//         ACL: "public-read-write",                 // defining the permissions to get the public link
//         ContentType: contentType                // Necessary to define the image content-type to view the photo in the browser with the link
//     };
//        try{
//         return s3.upload(params).promise()
//     } catch (e) {
//         console.log(e);
//         next(e)
//     }
// }

const uploadToS3 = async (filename, bodyBuffer, contentType, next) => {
  let folderName = "";
  const bucketName = process.env.S3_BUCKET;
  console.log(contentType);
  if (contentType === "image/png") {
    folderName = "images/";
  }
  if (contentType === "image/svg+xml") {
    folderName = "svgImages/";
  }
  if (contentType === "audio/mpeg") {
    folderName = "audio/";
  }
  if (contentType === "video/mp4") {
    folderName = "video/";
  }
  if (contentType === "application/pdf") {
    folderName = "invoices/";
  }
  const params = {
    Bucket: bucketName,
    Key: folderName,
  };
  try {
    await s3.headObject(params).promise();
    const fileKey = folderName + filename;
    const fileParams = {
      Bucket: bucketName,
      Key: fileKey,
      Body: bodyBuffer, // Body which will contain the image in buffer format
      ACL: "public-read-write", // defining the permissions to get the public link
      ContentType: contentType,
    };
    const data = await s3.upload(fileParams).promise();
    return data.Location;
  } catch (err) {
    if (err.code === "NotFound") {
      try {
        await s3.putObject(params).promise();
        const fileKey = folderName + filename;
        const fileParams = {
          Bucket: bucketName,
          Key: fileKey,
          Body: bodyBuffer, // Body which will contain the image in buffer format
          ACL: "public-read-write", // defining the permissions to get the public link
          ContentType: contentType,
        };
        const data = await s3.upload(fileParams).promise();
        console.log("PDF saved successfully");
        return data.Location;
      } catch (e) {
        console.log(e);
        throw new Error("Failed to save PDF");
      }
    } else {
      console.log(err);
      throw new Error("Failed to check folder existence");
    }
  }
};

module.exports = {
  uploadFile,
  uploadToS3,
};
