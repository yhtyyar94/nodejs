const S3 = require("./aws.config");
const BucketName = process.env.BucketName;
const { v4: uuidv4 } = require("uuid");

// CRUD Methods
const mutateS3 = {
  post: async (media) => {
    if (!media) {
      console.log("Upload media");
      return;
    }
    let result;
    const params = {
      Bucket: BucketName,
      Key: uuidv4() + ".id." + media.name,
      Body: media.data,
      COntentType: media.mimetype,
    };
    await S3.upload(params)
      .promise()
      .then((data) => {
        result = data;
      })
      .catch((err) => {
        result = err;
      });

    return result;
  },
  get: async (key) => {
    const params = {
      Bucket: BucketName,
      Key: key,
    };

    const signedUrl = S3.getSignedUrl("getObject", params);
    const url = signedUrl.slice(0, signedUrl.indexOf("AWSAccessKeyId") - 1);
    return url;
  },
  put: async (key, media) => {
    if (!media) {
      console.log("Upload media");
      return;
    }
    let result;
    const params = {
      Bucket: BucketName,
      Key: key,
      Body: media.data,
      COntentType: media.mimetype,
    };
    await S3.upload(params)
      .promise()
      .then((data) => {
        result = data;
      })
      .catch((err) => {
        result = err;
      });

    return result;
  },
  delete: async (key) => {
    let result;
    const params = {
      Bucket: BucketName,
      Key: key,
    };
    await S3.deleteObject(params)
      .promise()
      .then((data) => {
        result = data;
      })
      .catch((err) => {
        result = err;
      });
    return result;
  },
};

module.exports = mutateS3;
