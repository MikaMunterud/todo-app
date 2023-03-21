const { db } = require("../../database");
const { validateTodoListName } = require("../validations/validateTodoListName");

exports.todoListAdd = function (request, response) {
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
   * If the user wants to add a todo list, the following query below will be made.
   */
  const sqlQuery = `
    INSERT INTO todo_list
    (userID, name)
    VALUES( ? , ? )
  `;

  db.execute(sqlQuery, [loggedInUserID, name], function (error, result) {
    if (error) {
      /*
       * This checks that the new todo list does not match any other existing todo list.
       */
      if (error.code === "ER_DUP_ENTRY") {
        return response
          .status(409)
          .send(
            `Todo-list "${name}" already exists, please choose another name!`
          );
      }

      return response.status(500).send(error);
    }

    /*
     * The query has been successfully made!
     */
    response
      .status(201)
      .send(`Todo-list "${name}" has been created in your account!`);
  });
};
