const { db } = require("../../database");
const { groupTasksByList } = require("../../functions/groupTasksByList");
const {
  validateTodoListParams,
} = require("../validations/validateTodoListParams");

exports.taskGet = function (request, response) {
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
   * This validates that the value the user puts into the params.
   */
  const validationResult = validateTodoListParams(request.params);

  /*
   * This obtains the user data stored in the cookie and the data from the validated result.
   */
  const { todoListName, username } = validationResult.value;
  const loggedInUserID = request.loggedInUser.id;

  /*
   * If the user wants to get a specific todo list name task descriptions from a certain user,
   * the following query will be made.
   */
  const sqlQuery = `
      SELECT tl.name AS todoListName, 
        COALESCE(t.description, 'no task registered') AS description, 
        IF(t.done, true, false) AS done,
        u.username AS user
      FROM todo_list tl
      INNER JOIN user u ON tl.userID = u.id
      LEFT JOIN task t ON tl.id = t.todoListID
      WHERE (tl.userID = ?
      OR tl.userID IN (
      SELECT id FROM user WHERE id IN (
        SELECT userID FROM friend 
            WHERE id = ? AND verified = TRUE)
      ) )
        AND tl.name = ? 
        AND u.username = ?
    `;

  db.execute(
    sqlQuery,
    [loggedInUserID, loggedInUserID, todoListName, username],
    function (error, result) {
      if (error) {
        return response.status(500).send(error.sqlMessage);
      }

      /*
       * This checks if the query does not receive any data, The syntax of the query is correct but
       * no rows match the inputted data.
       */
      if (result.length === 0) {
        return response.status(404).send(
          `Something went wrong, either you do not have access to "${username}'s" todo lists or "${username}" does not 
            have a todo list named: "${todoListName}" please double check the username and todo list name!`
        );
      }

      /*
       * This sends the result to a function where all todo lists and tasks are grouped by user and todo lists.
       */
      const taskList = groupTasksByList(result);

      /*
       * The query has been successfully made!
       */
      return response.status(200).send(taskList);
    }
  );
  return;
};
