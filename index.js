const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const dbconnection = require("./db");
require("dotenv").config();
const helmet = require("helmet");
const authMiddleware=require("./middleware/auth.middleware");
const errorMiddleware=require("./middleware/error.middleware")

app.use(express.json());
app.use(helmet())
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', "POST", "DELETE", 'PUT'],
  credentials: true
}));
dbconnection();
app.use("/api/users/", require("./routes/user.router"));
app.use(authMiddleware)
app.use("/api/cars/", require("./routes/carsRoute"));
app.use("/api/bookings/", require("./routes/bookingsRoute"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// app.post("/paymentverification", (req, res) => {
//   const SECRET = "12345678";
//   // console.log(req.body);
//   const crypto = require("crypto");
//   var shasum = crypto.createHmac("sha256", SECRET);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");
//   // console.log(digest, req.headers("x-razorpay-signature"));
//   if (digest === req.headers("x-razorpay-signature")) {
//     console.log("request is legit");
//   } else {
//   }
//   res.json({ status: "ok" });
// });

app.use(errorMiddleware);
app.listen(PORT, () => console.log(`server started in ${PORT}`));
