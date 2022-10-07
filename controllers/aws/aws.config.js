const AWS = require("aws-sdk");

//env config
require("dotenv").config();
const accessKeyId = process.env.AccessKeyID;
const secretAccessKey = process.env.SecretAccessKey;

//initialize AWS
const S3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
});
module.exports = S3;
