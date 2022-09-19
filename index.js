const express = require("express");
const app = express();
require("dotenv").config();
var cookieParser = require("cookie-parser");
const upload = require("express-fileupload");
const cors = require("cors");
const PORT = process.env.PORT | 8888;
//import routes
const sfdcQuery = require("./routers/sfdc.routes");
const aws = require("./routers/aws.routes");

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

//routes
app.use("/", sfdcQuery);
app.use("/", aws);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
