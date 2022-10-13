const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not Authenticated");
    error.statucCode = 401;
    throw error;
  }

  const token = req.get("Authorization").split(" ")[1];
  let decodedToken = "";
  try {
    decodedToken = jwt.verify(token, process.env.USER_SECRET);
    console.log("16", decodedToken);
    if (!decodedToken) {
      const error = new Error("Not Authenticated");
      error.statusCode = 401;
      throw error;
    } else {
      //   console.log("else");
      User.findById(decodedToken._id)
        .then((user) => {
          req.userId = decodedToken.id;
          next();
        })
        .catch(() => {
          const error = new Error("No Admin Found");
          error.statusCode = 401;
          throw error;
        });
    }
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
};
