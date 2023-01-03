const express = require("express");
const app = express();
require("dotenv").config();
var cookieParser = require("cookie-parser");
const upload = require("express-fileupload");
const cors = require("cors");
const PORT = process.env.PORT;
const fs = require("fs");
//import routes
const sfdcQuery = require("./routers/sfdc.routes");
const aws = require("./routers/aws.routes");
const stripe = require("./routers/stripe.routes");
const test = require("./routers/test.routes");
const searchOnYoutube = require("./routers/youtube.routes");
const openai = require("./routers/openai.routes");
const telegram = require("./config/telegram");
const jimpFn = require("./config/sharp");
const Axios = require("axios");
const restart = require("./config/restart");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(upload());
app.use(cors());
app.use(express.static("public"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
telegram();

restart();

// const merge = require("./config/jimp");

// merge([
//   "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
//   "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png",
//   "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
// ]).then(async (data) => {
//   await data.writeAsync("merged.jpg");
// });

// jimpFn();

//Routes
app.use("/", sfdcQuery);
app.use("/", aws);
app.use("/", stripe);
app.use("/", test);
app.use("/", searchOnYoutube);
app.use("/", openai);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
