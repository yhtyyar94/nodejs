const searchOnYoutube = require("../controllers/youtube/youtube");

const router = require("express").Router();

router.get("/youtube/werhere", searchOnYoutube);

module.exports = router;
