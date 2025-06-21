const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const dbconnection = require("./db");
require("dotenv").config();
const helmet = require("helmet");
const authMiddleware = require("./middleware/auth.middleware");
const errorMiddleware = require("./middleware/error.middleware");
require("./jobs/booking");

app.use(express.json());
app.use(helmet())
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', "POST", "DELETE", 'PUT'],
  credentials: true
}));
dbconnection();
app.use("/api/users/", require("./routes/user.router"));
app.use("/api/bookings/", require("./routes/bookingsRoute"));
app.use(authMiddleware)
app.use("/api/cars/", require("./routes/carsRoute"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res) => {
  res.status(404).json({msg: "Route Not Found"})
});

app.use(errorMiddleware);
app.listen(PORT, () => console.log(`server started in ${PORT}`));
