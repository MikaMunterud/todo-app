const { db } = require("../../database");

exports.userDelete = function (request, response) {
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
   * This obtains the user data stored in the cookie.
   */
  const { username, id } = request.loggedInUser;

  /*
   * If the user wish to delete their account, the following query will be made.
   */
  const sqlQuery = `
    DELETE FROM user
    WHERE id = ?
  `;

  db.execute(sqlQuery, [id], function (error, result) {
    if (error) {
      return response.status(500).send(error.sqlMessage);
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

    if (result.affectedRows === 0) {
      return response
        .status(404)
        .send("User not found, deletion is not completed!");
    }

    /*
     * The query has been successfully made!
     */
    response
      .status(200)
      .send(`User: ${username} has been deleted from this application!`);
  });
};
