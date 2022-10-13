const express = require("express");
const { signUp, login, dummy } = require("../controllers/userController");
const userAuth = require("../middlewares/userAuth");
// const checkAuth = require("../middlewares/check-auth");

const routes = express.Router();

routes.post("/signup", signUp);
routes.post("/login", login);
routes.get("/dummy", userAuth, dummy);

module.exports = routes;
