const router = require("express").Router();
const { runBot } = require("../controllers/telegram/telegram");

router.get("/telegram", runBot);

module.exports = router;
