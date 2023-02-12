const router = require("express").Router();
const {getProfile} = require("../controller/user-controller");

router.get("/profile/:username",getProfile);


module.exports = router;