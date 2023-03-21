const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

/*
 * This middleware creates a cookie containing the logged in user information.
 */
exports.createAuthentication = function (response, userCopy) {
  const authenticationToken = jwt.sign(userCopy, secret, {
    expiresIn: "7 days",
  });

  response.cookie("authenticationToken", authenticationToken, {
    maxAge: 345600000,
    sameSite: "none",
    secure: true,
    httpOnly: true,
  });
};
