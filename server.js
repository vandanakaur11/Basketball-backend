const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
var cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const connectDB = require("./db/db");
require("dotenv").config();

const app = express();

// connect database
connectDB();
// middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// routes
const userRoutes = require("./routes/user");

app.use("/user", userRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT} `));
