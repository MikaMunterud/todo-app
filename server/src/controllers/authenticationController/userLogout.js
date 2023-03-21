exports.userLogout = function (request, response) {
  /*
   * This validates that the user does not send in data in the query or body.
   */
  const query = request.query;
  const body = request.body;

  const queryKeys = Object.keys(query);
  const bodyKeys = Object.keys(body);

  if (queryKeys.length > 0 || bodyKeys.length > 0) {
    return response.status(400).send("Please do not send in data");
  }

  /*
   * This removes the cookie from the client side so the user information is not visibly
   * stored and the different pages will not think that the user is still logged in.
   */
  const authenticationToken = request.cookies.authenticationToken;

  response.cookie("authenticationToken", authenticationToken, {
    maxAge: 0,
    sameSite: "none",
    secure: true,
    httpOnly: true,
  });

  response.status(200).send("You have been successfully logged out!");
};
