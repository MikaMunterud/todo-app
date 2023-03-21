const { db } = require("../../database");
const { validateTask } = require("../validations/validateTask");

exports.taskDelete = function (request, response) {
  /*
   * This validates the request body that the user has inputted
   */
  const validationResult = validateTask(request.body);

  if (validationResult.error) {
    return response.status(400).send(validationResult.error.details[0].message);
  }

  /*
   * This obtains the user data stored in the cookie and the data from the validated result.
   */
  const loggedInUserID = request.loggedInUser.id;
  const { todoListName, description, friend } = validationResult.value;

  /*
   * If the user wants to delete a friends todo list task the following query below will be made.
   */
  if (friend) {
    const sqlQuery = `
      DELETE FROM task
      WHERE todoListID IN (
        SELECT tl.id
        FROM todo_list tl
        INNER JOIN user friend ON friend.username = ? 
        INNER JOIN friend f ON f.id = ? AND f.userID = friend.id AND f.verified = TRUE
        WHERE tl.userID = friend.id
        AND tl.name = ? 
      )
      AND description = ?; 
    `;

    db.execute(
      sqlQuery,
      [friend, loggedInUserID, todoListName, description],
      function (error, result) {
        if (error) {
          return response.status(500).send(error);
        }

        /*
         * This checks if the query does not delete anything, The syntax of the query is correct but
         * no rows match the inputted data.
         */
        if (result.affectedRows === 0) {
          return response
            .status(404)
            .send(
              `Something went wrong, either you do not have access to  "${friend}'s" todo lits or "${friend}" does not have a todo list named: "${todoListName}" or the task description does not match anything in todo list: "${todoListName}", please check the friend, todo list name and task description information!`
            );
        }

        /*
         * The query has been successfully made!
         */
        response
          .status(200)
          .send(
            `Task "${description}" has been removed from friend: "${friend}'s" todo list: ${todoListName}!`
          );
      }
    );
    return;
  }
  /*
   * If the user wants to delete their own todo list task the following query below will be made.
   */

  const sqlQuery = `
    DELETE FROM task
    WHERE description = ?
    AND todoListID IN (
    SELECT id FROM todo_list
    WHERE userID = ?
    AND name = ? );
    `;

  db.execute(
    sqlQuery,
    [description, loggedInUserID, todoListName],
    function (error, result) {
      if (error) {
        return response.status(500).send(error.sqlMessage);
      }

      /*
       * This checks if the query does not delete anything, The syntax of the query is correct but
       * no rows match the inputted data.
       */
      if (result.affectedRows === 0) {
        return response
          .status(404)
          .send(
            `Task: "${description}" does not exist in todo list: "${todoListName}", please try another name or description!`
          );
      }

      /*
       * If the user wants to delete their own todo list task the following query below will be made.
       */
      response
        .status(200)
        .send(
          `Task: "${description}" has been deleted from todo-list: "${todoListName}"!`
        );
    }
  );
};
