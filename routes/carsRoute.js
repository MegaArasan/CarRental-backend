const express = require("express");
const {getCars} = require("../controller/car.controller");
const router = express.Router();

router.get("/getallcars", getCars);

module.exports = router;
