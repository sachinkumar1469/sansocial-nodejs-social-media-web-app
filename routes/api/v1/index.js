const router = require("express").Router();

router.use("/posts",require("./post_api"));

router.use("/users",require("./user_api"));

module.exports = router;