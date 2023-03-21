const { db } = require("../../database");
const { validateTodoListName } = require("../validations/validateTodoListName");

exports.todoListDelete = function (request, response) {
  /*
   * This validates the request body that the user has inputted
   */
  const validationResult = validateTodoListName(request.body);

  if (validationResult.error) {
    return response.status(400).send(validationResult.error.details[0].message);
  }

  /*
   * This obtains the user data stored in the cookie and the data from the validated result.
   */
  const loggedInUserID = request.loggedInUser.id;
  const { name } = validationResult.value;

  /*
   * If the user wants to delete their own todo list the following query below will be made.
   */
  const sqlQuery = `
    DELETE FROM todo_list
    WHERE userID = ? AND name = ?
    `;

  db.execute(sqlQuery, [loggedInUserID, name], function (error, result) {
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
        .send(`Todo-list ${name} does not exists, please try another name!`);
    }

    /*
     * The query has been successfully made!
     */
    response.status(200).send(`Todo-list "${name}" has been deleted!`);
  });
};
