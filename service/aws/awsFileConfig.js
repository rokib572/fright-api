const AWS = require("aws-sdk");
const uuid = require("uuid").v4;

AWS.config.update({
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3UploadV2 = async (files, folderName) => {
  const params = files.map((file) => ({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: folderName
      ? `${folderName}/${uuid()}-${file.originalname}`
      : `${uuid()}-${file.originalname}`,
    Body: file.buffer,
  }));

  return Promise.all(params.map((param) => s3.upload(param).promise()));
};

const s3GetFileUrl = async (fileKey) => {
  const myBucket = process.env.AWS_BUCKET_NAME;
  const myKey = fileKey;
  const signedUrlExpireSeconds = 60 * 60;

  const url = s3.getSignedUrl("getObject", {
    Bucket: myBucket,
    Key: myKey,
    Expires: signedUrlExpireSeconds,
  });
  return url;
};

const s3FileDelete = async (fileKey) => {
  var params = { Bucket: process.env.AWS_BUCKET_NAME, Key: fileKey };

  s3.deleteObject(params, function (err, data) {
    if (err) {  // error
      console.log(err, err.stack);
      return false;
    }
    else return true; // deleted
  });
};

module.exports = { s3UploadV2, s3GetFileUrl, s3FileDelete };
