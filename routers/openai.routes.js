const res = require("../controllers/openai/chatgpt");

const router = require("express").Router();

router.get("/openai/chatgpt", res);

module.exports = router;
