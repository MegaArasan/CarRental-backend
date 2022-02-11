const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const dbconnection = require("./db");
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
app.use(cors());
dbconnection();

app.use("/api/cars/", require("./routes/carsRoute"));
app.use("/api/users/", require("./routes/usersRoute"));
app.use('/api/bookings/' , require('./routes/bookingsRoute'))

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, () => console.log(`server started in ${PORT}`));
