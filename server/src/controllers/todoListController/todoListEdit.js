const { db } = require("../../database");
const {
  validateTodoListNames,
} = require("../validations/validateTodoListNames");

exports.todoListEdit = function (request, response) {
  /*
   * This validates the request body that the user has inputted
   */
  const validationResult = validateTodoListNames(request.body);

  if (validationResult.error) {
    return response.status(400).send(validationResult.error.details[0].message);
  }

  /*
   * This obtains the user data stored in the cookie and the data from the validated result.
   */
  const loggedInUserID = request.loggedInUser.id;
  const { currentName, name } = validationResult.value;

  /*
   * This checks that the new todo list name is not the same as the current todo list name.
   */
  if (currentName.toLowerCase() === name.toLowerCase()) {
    return response
      .status(409)
      .send(
        `There is no difference between the current todo-list name and the new name!`
      );
  }

  /*
   * If the user wants to edit their todo list name the following query below will be made.
   */
  const sqlQuery = `
      UPDATE todo_list
      SET name = ?
      WHERE userID = ? AND name = ?
  `;

  db.execute(
    sqlQuery,
    [name, loggedInUserID, currentName],
    function (error, result) {
      if (error) {
        /*
         * This checks that the new todo list name does not match any other existing todo list names.
         */
        if (error.code === "ER_DUP_ENTRY") {
          return response
            .status(409)
            .send(
              `Todo-list "${name}" already exists, please choose another name!`
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
            `Todo-list ${currentName} does not exists, please try another name!`
          );
      }

      /*
       * The query has been successfully made!
       */
      response.status(200).send(`Todo-list has been edited to ${name}!`);
    }
  );
};
