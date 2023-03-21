const { db } = require("../../database");
const { validateUsername } = require("../validations/validateUsername");

exports.friendDelete = function (request, response) {
  /*
   * This validates the request body that the user has inputted
   */
  const validationResult = validateUsername(request.body);

  if (validationResult.error) {
    return response.status(400).send(validationResult.error.details[0].message);
  }

  /*
   * This obtains the user data stored in the cookie and the data from the validated result.
   */
  const loggedInUserID = request.loggedInUser.id;
  const { username } = request.loggedInUser;
  const friend = validationResult.value.username;

  /*
   * This checks that the user do not try to delete them self as a friend.
   */
  if (friend.toLowerCase() === username.toLowerCase()) {
    response.status(403).send(`You cannot have yourself as a friend!`);
    return;
  }

  /*
   * If the user wish to delete a friend, the following query will be made.
   */
  const sqlQuery = `
  DELETE FROM friend
  WHERE userID = ? AND 
  id = (SELECT id FROM user WHERE username = ?)
`;

  db.execute(sqlQuery, [loggedInUserID, friend], function (error, result) {
    if (error) {
      return response.status(500).send(error.sqlMessage);
    }

    /*
     * This checks if the query does not delete anything. The syntax of the query is correct but
     * no rows match the inputted data.
     */
    if (result.affectedRows === 0) {
      return response
        .status(404)
        .send(`You do not have ${friend} on your friend list!`);
    }

    /*
     * The query has been successfully made!
     */
    response
      .status(200)
      .send(`${friend} has been removed from your friend list!`);
  });
};
