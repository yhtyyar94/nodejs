const checkout = require("../controllers/stripe/stripe");

const router = require("express").Router();

router.post("/stripe/checkout", checkout);

module.exports = router;
