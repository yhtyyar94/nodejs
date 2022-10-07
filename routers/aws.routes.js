const router = require("express").Router();
const upload = require("../controllers/aws/S3LargeObject");
const mutateS3 = require("../controllers/aws/S3");
const S3Mutations = require("../controllers/aws/S3");

router.get("/aws/s3/", async (req, res) => {
  const url = await S3Mutations.get(
    "0e2cff74-2979-40bf-a367-93d1ed6bbb90.id.image (1).png"
  );
  res.send(url);
});

router.post("/aws/s3/", async (req, res) => {
  if (!req.files?.media) {
    return res.json({ error: "req.files.media is missing!" });
  }

  const data = await S3Mutations.post(req.files?.media);
  res.json({ data });
});

router.put("/aws/s3/", async (req, res) => {
  if (!req.files?.media) {
    return res.json({ error: "req.files.media is missing!" });
  }

  const data = await S3Mutations.put(
    "cc563087-b97a-44e5-a60e-44f3d36fc191.id.adb804f7-59af-4205-ba1d-c2583185b9c5.jpg",
    req.files?.media
  );
  res.json({ data });
});

router.delete("/aws/s3/", async (req, res) => {
  const data = await S3Mutations.delete(
    "cc563087-b97a-44e5-a60e-44f3d36fc191.id.adb804f7-59185b9c5.jpg"
  );
  res.json({ data });
});

router.post("/aws/s3/upload", async (req, res) => {
  const data = await upload(req.files.media);
  res.json({ data });
});

module.exports = router;
