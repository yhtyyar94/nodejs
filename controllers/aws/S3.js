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
        result = "Del";
      })
      .catch((err) => {
        result = err;
      });
    return result;
  },
  createMultiPart: async () => {
    const params = {
      Bucket: BucketName,
      Key: "largeObject",
    };
    try {
      const result = await S3.createMultipartUpload(params).promise();
      console.log(result);
      return result;
    } catch (error) {
      return error;
    }
  },
  multiPartUpload: async (media) => {
    const params = {
      Bucket: BucketName,
      Key: "largeObject",
      UploadId:
        "zW7rwhEr1J4yfr7ss1u6BCFFWJyJmj4Jg1vPgGGt1XAtE3RqJeELsFdVi8msQNseHLpMWqu25jqpzP1rBHRFM9ER83JGYzyOb0dbe9MZgo8-",
      Body: media.data,
      PartNumber: 10,
    };
    return await S3.uploadPart(params).promise();
  },
  completeMultiPartUpload: async () => {
    const params = {
      Bucket: BucketName,
      Key: "largeObject",
      UploadId:
        "zW7rwhEr1J4yfr7ss1u6BCFFWJyJmj4Jg1vPgGGt1XAtE3RqJeELsFdVi8msQNseHLpMWqu25jqpzP1rBHRFM9ER83JGYzyOb0dbe9MZgo8-",
      MultipartUpload: {
        Parts: [
          {
            ETag: "f29970c6bf3945933b8f87541fa2b0de",
            PartNumber: 10,
          },
        ],
      },
    };
    return await S3.completeMultipartUpload(params).promise();
  },
};

module.exports = mutateS3;
