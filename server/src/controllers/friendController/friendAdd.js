const { db } = require("../../database");
const { validateUsername } = require("../validations/validateUsername");

exports.friendAdd = function (request, response) {
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
   * This checks that the user do not try to add them self as a friend.
   */
  if (friend.toLowerCase() === username.toLowerCase()) {
    response.status(403).send(`You cannot add yourself as a friend!`);
    return;
  }

  /*
   * If the user wants to add a friend, the following query below will be made.
   */
  const sqlQuery = `
    INSERT INTO friend
    (userID, id)
    VALUES( ? , (SELECT id FROM user WHERE username = ?) )
  `;

  db.execute(sqlQuery, [loggedInUserID, friend], function (error, result) {
    if (error) {
      /*
       * This checks that the user does not try to add the same friend twice.
       */
      if (error.code === "ER_DUP_ENTRY") {
        return response
          .status(409)
          .send(`You have already sent a friend request to: ${friend}!`);
      }

      return response.status(500).send(error);
    }

    /*
     * The query has been successfully made!
     */
    response
      .status(200)
      .send(
        `${friend} has been registered into your account, awaiting their verification before they can access your todo-lists!`
      );
  });
};
