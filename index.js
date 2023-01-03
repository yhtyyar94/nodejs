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
const { default: axios } = require("axios");

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

const restart = setInterval(async () => {
  try {
    const res = await axios.get("https://my-nodejs-backend.onrender.com");
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
}, 1800000);

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
