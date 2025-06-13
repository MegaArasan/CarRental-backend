const express = require("express");
const router = express.Router();
const {addBooking, getBooking, confirmBooking} = require("../controller/booking.controller");
const auth = require("../middleware/auth.middleware");
const verifySignature = require("../middleware/verifySignature")

router.post("/bookcar", auth, addBooking);

router.get("/getallbookings", auth, getBooking);

router.post("/verify",  verifySignature, confirmBooking);


module.exports = router;
