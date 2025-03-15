// ENV Declarations
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Declaring cloud databases
const dbUrl = process.env.ATLAS_URL;

//Requiring Packages
const express = require("express");
const app = express();
const coupounsModel = require("./models/coupons.js");
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const routes = require("./routes/User.js");
const couponRoutes = require("./routes/User.js");
const cors = require("cors");

app.use(cors()); //Allow cross origin resource sharing
app.use(express.json()); //parse the data

//Databases connection
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Database Connected Succesfully ");
  })
  .catch((err) => {
    console.log(err);
  });
//Routes Declaration
app.use("/api/v1/users", routes);
app.use("/api/coupons", couponRoutes); // Use coupon routes

//Fetcing the data from the databases
app.get("/couponsDetails", async (req, res) => {
  try {
    let Couponsdata = await coupounsModel.find({});
    res.json(Couponsdata);
  } catch (err) {
    res.status(httpStatus.ERROR).json({ message: "Error While storing daty" });
  }
});

//Checking for the server connections
app.listen(port, () => {
  console.log(`Server is listening to the port ${port}`);
});
