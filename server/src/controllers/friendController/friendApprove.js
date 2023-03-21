const { db } = require("../../database");
const {
  validateFriendMessage,
} = require("../validations/validateFriendMessage");

exports.friendApprove = function (request, response) {
  /*
   * This validates the request body that the user has inputted
   */
  const validationResult = validateFriendMessage(request.body);

  if (validationResult.error) {
    return response.status(400).send(validationResult.error.details[0].message);
  }

  /*
   * This obtains the user data stored in the cookie and the data from the validated result.
   */
  const loggedInUserID = request.loggedInUser.id;
  const { username } = request.loggedInUser;
  const { friend, message } = validationResult.value;

  /*
   * This checks that the user do not try to add them self as a friend.
   */
  if (friend.toLowerCase() === username.toLowerCase()) {
    response.status(403).send(`You cannot have yourself as a friend!`);
    return;
  }

  /*
   * This sets the verified value depending on the message, if the message is 'approved' then the friendship is
   * verified, otherwise verified will be false.
   */
  let verified = null;
  if (message === "approved") {
    verified = true;
  } else {
    verified = false;
  }

  /*
   * If the user wish to verify the received friend request, the following query will be made.
   */
  const sqlQuery = `
    UPDATE friend
    SET verified = ?, message = ?
    WHERE userID = (SELECT id FROM user WHERE username = ?)  AND 
    id = ? 
  `;

  db.execute(
    sqlQuery,
    [verified, message, friend, loggedInUserID],
    function (error, result) {
      if (error) {
        return response.status(500).send(error);
      }

      /*
       * This checks if the query does not edit anything. The syntax of the query is correct but
       * no rows match the inputted data.
       */
      if (result.affectedRows === 0) {
        return response
          .status(404)
          .send(`You do not have a any pending friend request from ${friend}!`);
      }

      /*
       * This checks if the query does not edit anything. The syntax of the query is correct and matching
       * data was found but there is no difference in the editing request.
       */
      if (result.info === "Rows matched: 1  Changed: 0  Warnings: 0") {
        return response
          .status(409)
          .send(`You have already ${message} ${friend}'s friend request!`);
      }

      /*
       * The query has been successfully made but the user have rejected the friend request!
       */
      if (message === "rejected") {
        return response
          .status(200)
          .send(`You have rejected ${friend}'s friend request!`);
      }

      /*
       * The query has been successfully made and the user have approved the friend request!
       */
      response
        .status(200)
        .send(
          `You have approved ${friend}'s friend request, you can now access their todo-lists!`
        );
    }
  );
};
