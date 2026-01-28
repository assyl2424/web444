require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const measurementRoutes = require("./routes/measurements.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/measurements", measurementRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});