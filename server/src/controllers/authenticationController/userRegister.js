const { db } = require("../../database");
const bcrypt = require("bcrypt");
const {
  validateUsernamePassword,
} = require("../validations/validateUsernamePassword");

exports.userRegister = function (request, response) {
  /*
   * This validates the request body that the user has inputted
   */
  const validatedUser = validateUsernamePassword(request.body);

  if (validatedUser.error) {
    response.status(400).send(validatedUser.error.details[0].message);
    return;
  }

  /*
   * This obtains the users current data from the validated result.
   */
  const { username, password } = validatedUser.value;

  /*
   * The password is hashed so it can be securely stored in the database by using bcrypt.
   */
  const securePassword = bcrypt.hashSync(password, 10);

  /*
   * If the user wants to register, the below query will be made.
   */
  const sqlQuery = `
      INSERT INTO user 
      (username, password)
      VALUES( ? , ? )
        `;

  db.execute(sqlQuery, [username, securePassword], function (error, result) {
    if (error) {
      /*
       * This checks that the user has not entered a username that already exists in the database.
       */
      if (error.code === "ER_DUP_ENTRY") {
        return response
          .status(409)
          .send(`Username: ${username} already exists!`);
      }

      return response.status(500).send(error.sqlMessage);
    }

    /*
     * The query has been successfully made!
     */
    response.status(201).send(`User: ${username} has been registered!`);
  });
};
