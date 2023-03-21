const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

/*
 * This middleware checks if a user is logged in by checking if a cookie exists containing the user information.
 */
exports.checkAuthentication = function (request, response, next) {
  const authenticationToken = request.cookies.authenticationToken;
  try {
    const loggedInUser = jwt.verify(authenticationToken, secret);
    request.loggedInUser = loggedInUser;
    next();
  } catch (error) {
    response.status(401).send("Please login to access account settings!");
  }
};
