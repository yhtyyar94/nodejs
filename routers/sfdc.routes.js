const { sfdcQuery } = require("../controllers/sfdc/sfdc");

const router = require("express").Router();

router.get("/sfdc", sfdcQuery);

module.exports = router;
