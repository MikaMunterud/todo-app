const { db } = require("../../database");
const { friendRequests } = require("../../functions/friendRequests");

exports.friendGet = function (request, response) {
  /*
   * This validates that the user does not send in data in the query or body.
   */
  const query = request.query;
  const body = request.body;

  const queryKeys = Object.keys(query);
  const bodyKeys = Object.keys(body);

  if (queryKeys.length > 0 || bodyKeys.length > 0) {
    response.status(400).send("Please do not send in data");
    return;
  }

  /*
   * This obtains the user data stored in the cookie and the data from the validated result.
   */
  const { username } = request.loggedInUser;
  const loggedInUserID = request.loggedInUser.id;

  /*
   * If the user wants to get a all friend information, the following query will be made.
   */
  const getAllFriends = `
    SELECT u1.username AS user, 
      u2.username AS friend,
      IF(f.verified, 'true', 'false') AS verified,
      f.message
    FROM friend f
    JOIN user u1 ON u1.id = f.userID
    JOIN user u2 ON u2.id = f.id
    WHERE f.userID = ? OR f.id = ?
 `;

  db.execute(
    getAllFriends,
    [loggedInUserID, loggedInUserID],
    function (error, result) {
      if (error) {
        return response.status(500).send(error);
      }

      /*
       * This checks if the query does not receive anything. The syntax of the query is correct but
       * no rows match the inputted data.
       */
      if (result.length === 0) {
        return response
          .status(404)
          .send(
            "You have not sent or received any friend requests on your account!"
          );
      }

      /*
       * This sends the result to a function where all friends requests statuses are checked.
       */
      const friends = friendRequests(result, username);

      /*
       * The query has been successfully made!
       */
      response.status(200).send(friends);
    }
  );
};
