const { db } = require("../../database");

exports.todoListGet = function (request, response) {
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

  const loggedInUserID = request.loggedInUser.id;

  /*
   * If the user wants to get all todo list names, the following query will be made.
   */
  const sqlQuery = `
    SELECT tl.name AS 'todoList', 
    COUNT(t.id) AS 'taskCount',
    u.username AS 'user'
    FROM todo_list tl
    LEFT JOIN task t ON tl.id = t.todoListID
    INNER JOIN user u ON tl.userID = u.id
    WHERE tl.userID = ? 
    OR tl.userID IN (
      SELECT id FROM user WHERE id IN (
        SELECT userID FROM friend 
        WHERE id = ? AND verified = TRUE)
    ) 
    GROUP BY tl.id
    ORDER BY tl.name, u.username
`;

  db.execute(
    sqlQuery,
    [loggedInUserID, loggedInUserID],
    function (error, result) {
      if (error) {
        return response.status(500).send(error.sqlMessage);
      }

      /*
       * This checks if the query does not receive any data, The syntax of the query is correct but
       * no rows match the inputted data.
       */
      if (result.length === 0) {
        return response
          .status(404)
          .send("You do not have any todo-lists registered on your account!");
      }

      /*
       * The query has been successfully made!
       */
      return response.status(200).send(result);
    }
  );
};
