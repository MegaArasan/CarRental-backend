const express = require("express");
const {getCars} = require("../controllers/car.controller");
const router = express.Router();

router.get("/getallcars", getCars);

module.exports = router;
