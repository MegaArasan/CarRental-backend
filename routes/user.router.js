const express = require("express");
const router = express.Router();
const {login, register, forgetPasseord, resetPassword} = require("../controller/user.controller");

router.post("/login", login);

router.post("/register", register)

router.post("/forgotpassword", forgetPasseord);

router.post("/password-reset/:userId/:token", resetPassword)


module.exports = router;
