const express = require("express");

const {
  userDelete,
} = require("../controllers/authenticationController/userDelete");

const {
  userRegister,
} = require("../controllers/authenticationController/userRegister");

const {
  userLogin,
} = require("../controllers/authenticationController/userLogin");

const {
  checkAuthentication,
} = require("../controllers/middleware/checkAuthentication");

const {
  userEditPassword,
} = require("../controllers/authenticationController/userEditPassword");

const {
  userLogout,
} = require("../controllers/authenticationController/userLogout");

const authenticationRoute = express.Router();

/*
 * This route makes it possible for a user to log in to this application.
 */
authenticationRoute.post("/login", userLogin);

/*
 * This route makes it possible for a user to register themselves to this application.
 */
authenticationRoute.post("/register", userRegister);

/*
 * This route makes it possible for a user to delete themselves from this application.
 */
authenticationRoute.delete("/deleteUser", checkAuthentication, userDelete);

/*
 * These routes makes it possible for a user to edit their username or password.
 */
authenticationRoute.patch(
  "/editPassword",
  checkAuthentication,
  userEditPassword
);

authenticationRoute.post("/logoutUser", checkAuthentication, userLogout);

exports.authenticationRoute = authenticationRoute;
