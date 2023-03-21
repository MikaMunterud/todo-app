const { db } = require("../../database");
const { validateTask } = require("../validations/validateTask");

exports.taskAdd = function (request, response) {
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
   * If the user wants to add a task to a friends todo list, the following query below will be made.
   */
  if (friend) {
    const sqlQuery = `
      INSERT INTO task (todoListID, description)
      SELECT tl.id, ?
      FROM todo_list tl
      INNER JOIN user friend ON friend.username = ?
      INNER JOIN friend f ON f.id = ? AND f.userID = friend.id AND f.verified = TRUE
      WHERE tl.userID = friend.id
      AND tl.name = ?;
    `;

    db.execute(
      sqlQuery,
      [description, friend, loggedInUserID, todoListName],
      function (error, result) {
        if (error) {
          /*
           * This checks that the new task does not match any other existing task in the friends todo list.
           */
          if (error.code === "ER_DUP_ENTRY") {
            return response
              .status(409)
              .send(
                `Task "${description}" already exists in todo list: "${todoListName}", please choose another description!`
              );
          }

          return response.status(500).send(error.sqlMessage);
        }

        /*
         * This checks if the query does not add anything, The syntax of the query is correct but
         * no rows match the inputted data.
         */
        if (result.affectedRows === 0) {
          return response
            .status(404)
            .send(
              `Something went wrong, either you do not have access to  "${friend}'s" todo lits or "${friend}" does not have a todo list named: "${todoListName}", please double check the friend and todo list name information!`
            );
        }

        /*
         * The query has been successfully made!
         */
        response
          .status(201)
          .send(
            `Task "${description}" has been added to friend: "${friend}'s" todo list: ${todoListName}!`
          );
      }
    );
    return;
  }

  /*
   * If the user wants to add a task to their own todo list, the following query below will be made.
   */
  const sqlQuery = `
    INSERT INTO task
    (todoListID, description)
    VALUES( (SELECT id FROM todo_list where userID = ? AND name = ?), ? )
  `;

  db.execute(
    sqlQuery,
    [loggedInUserID, todoListName, description],
    function (error, result) {
      if (error) {
        /*
         * This checks that the new task does not match any other existing task in the users todo list.
         */
        if (error.code === "ER_DUP_ENTRY") {
          return response
            .status(409)
            .send(
              `Task "${description}" already exists in todo list: "${todoListName}", please choose another description!`
            );
        }

        return response.status(500).send(error.sqlMessage);
      }

      /*
       * The query has been successfully made!
       */
      response
        .status(201)
        .send(
          `Task "${description}" has been added to todo list: ${todoListName}!`
        );
    }
  );
};
