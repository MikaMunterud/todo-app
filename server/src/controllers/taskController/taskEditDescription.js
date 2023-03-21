const { db } = require("../../database");
const {
  validateTaskEditDescription,
} = require("../validations/validateTaskEditDescription");

exports.taskEditDescription = function (request, response) {
  /*
   * This validates the request body that the user has inputted
   */
  const validationResult = validateTaskEditDescription(request.body);

  if (validationResult.error) {
    return response.status(400).send(validationResult.error.details[0].message);
  }

  /*
   * This obtains the user data stored in the cookie and the data from the validated result.
   */
  const loggedInUserID = request.loggedInUser.id;
  const { todoListName, currentDescription, newDescription, friend } =
    validationResult.value;

  /*
   * If the user wants to edit a todo list task description one of the following queries below will be made.
   * It all depend on if the user will edit their own todo list task or edit a friends todo list task.
   */

  /*
   * This checks that the new description is not the same as the current description.
   */
  if (currentDescription === newDescription) {
    return response
      .status(409)
      .send(
        `There is no difference between the current description and the new description!`
      );
  }

  /*
   * If the user wants to edit a friends todo list task description the following query below will be made.
   */
  if (friend) {
    const sqlQuery = `
    UPDATE task
    SET description = ?
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
      [
        newDescription,
        friend,
        loggedInUserID,
        todoListName,
        currentDescription,
      ],
      function (error, result) {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            return response
              .status(409)
              .send(
                `Task "${newDescription}" already exists in todo list: "${todoListName}", please choose another description!`
              );
          }

          return response.status(500).send(error);
        }

        /*
         * This checks if the query does not edit anything, The syntax of the query is correct but
         * no rows match the inputted data.
         */
        if (result.affectedRows === 0) {
          return response
            .status(404)
            .send(
              `Something went wrong, either you do not have access to  "${friend}'s" todo lits or "${friend}" does not have a todo list named: "${todoListName}" or the task description does not match anything in todo list: "${todoListName}", please double check the friend, todo list name and task description information!`
            );
        }

        /*
         * The query has been successfully made!
         */
        response
          .status(200)
          .send(
            `Task: "${currentDescription}" has been updated to "${newDescription}" in "${friend}'s" todo list: "${todoListName}"!`
          );
      }
    );
    return;
  }

  /*
   * If the user wants to edit their own todo list task description the following query below will be made.
   */
  const sqlQuery = `
      UPDATE task SET description = ?
      WHERE description = ?
      AND todoListID = (
      SELECT id FROM todo_list
      WHERE userID = ?
      AND name = ?)
  `;

  db.execute(
    sqlQuery,
    [newDescription, currentDescription, loggedInUserID, todoListName],
    function (error, result) {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return response
            .status(409)
            .send(
              `Task "${newDescription}" already exists in todo list: "${todoListName}", please choose another description!`
            );
        }

        return response.status(500).send(error.sqlMessage);
      }

      /*
       * This checks if the query does not edit anything, The syntax of the query is correct but
       * no rows match the inputted data.
       */
      if (result.affectedRows === 0) {
        return response
          .status(404)
          .send(
            `Task: "${currentDescription}" does not exist in todo list: "${todoListName}", please try another name or description!`
          );
      }

      /*
       * The query has been successfully made!
       */
      response
        .status(200)
        .send(
          `Task: "${currentDescription}" has been updated to "${newDescription}" in your todo list: "${todoListName}"!`
        );
    }
  );
};
