require("dotenv").config();
const S3 = require("./aws.config");
const fs = require("fs");

const startUpload = async () => {
  const params = {
    Bucket: process.env.BucketName,
    Key: "test1",
  };
  try {
    const result = await S3.createMultipartUpload(params).promise();
    return result;
  } catch (error) {
    return error;
  }
};

const uploadPart = (buffer, uploadId, partNumber) => {
  const params = {
    Key: "test1",
    Bucket: process.env.BucketName,
    Body: buffer,
    PartNumber: partNumber, // Any number from one to 10.000
    UploadId: uploadId, // UploadId returned from the first method
  };

  return new Promise(async (resolve, reject) => {
    try {
      const result = await S3.uploadPart(params).promise();
      console.log(result, 2);
      return resolve({ PartNumber: partNumber, ETag: result.ETag });
    } catch (error) {
      return reject({ PartNumber: partNumber, error: error.message });
    }
    // S3.uploadPart(params, (err, data) => {
    //   if (err) return reject({ PartNumber: partNumber, error: err });
    //   console.log(data, 2);
    //   return resolve({ PartNumber: partNumber, ETag: data.ETag });
    // });
  });
};

const abortUpload = async (uploadId) => {
  const params = {
    Key: "test1",
    Bucket: process.env.BucketName,
    UploadId: uploadId,
  };
  return new Promise((resolve, reject) => {
    S3.abortMultipartUpload(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};
const completeUpload = async (uploadId, parts) => {
  const params = {
    Key: "test1",
    Bucket: process.env.BucketName,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  };
  return new Promise(async (resolve, reject) => {
    try {
      const result = await S3.completeMultipartUpload(params).promise();
      console.log(result, 6);
      return resolve(result);
    } catch (error) {
      return reject(error);
    }
    // S3.completeMultipartUpload(params, (err, data) => {
    //   if (err) return reject(err);
    //   return resolve(data);
    // });
  });
};

const upload = async (media) => {
  try {
    const file = media.data; // read the file from the path specified
    const chunkSize = Math.pow(1024, 2) * 8; // chunk size is set to 8MB
    const fileSize = file.byteLength;
    const iterations = Math.ceil(fileSize / chunkSize); // number of chunks to be broken
    const arr = Array.from(Array(iterations).keys()); // dummy array to loop through
    // we will use this later
    console.log(arr, iterations, fileSize, chunkSize);
    const { UploadId: uploadId } = await startUpload();
    console.log(uploadId); // this will start the connection and return UploadId
    const parts = await Promise.allSettled(
      arr.map(async (item) => {
        console.log(item, 7);
        return await uploadPart(
          file.slice(item * chunkSize, item * chunkSize),
          uploadId,
          item + 1
        );
      })
    );
    console.log(parts, "1");
    /*
          The response looks like this ->
          [
            { status: "rejected", reason: { PartNumber: "1234", error: {...} } }
            { status: "fulfilled", reason: { PartNumber: "1234", ETag: '"d8c2eafd90c266e19ab9dcacc479f8af"' } }
          ]
          Now we can retry uploading the rejected Parts!
          */
    const failedParts = parts
      .filter((part) => part.status === "rejected")
      .map((part) => part.reason);
    console.log(failedParts, 4);
    const succeededParts = parts
      .filter((part) => part.status === "fulfilled")
      .map((part) => part.value);
    console.log(succeededParts, 5);
    let retriedParts = [];
    if (!failedParts.length)
      // if some parts got failed then retry
      retriedParts = await Promise.all(
        failedParts.map(({ PartNumber }) =>
          uploadPart(
            data.slice((PartNumber - 1) * chunkSize, PartNumber * chunkSize),
            uploadId,
            PartNumber
          )
        )
      );
    console.log(retriedParts, "3");
    succeededParts.push(...retriedParts); // when the failed parts succeed after retry
    const data = await completeUpload(
      uploadId,
      succeededParts.sort((a, b) => a.PartNumber - b.PartNumber) // needs sorted array
    );
    console.log(data.Location); // the URL to access the object in S3
  } catch (err) {
    console.error(err);
  }
};

module.exports = upload;
