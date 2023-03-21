require("dotenv").config();
const { db } = require("../../database");
const bcrypt = require("bcrypt");
const {
  validateUsernamePassword,
} = require("../validations/validateUsernamePassword");
const { createAuthentication } = require("../middleware/createAuthentication");

exports.userLogin = function (request, response) {
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
   * If the user wants to log in, the below query will be made.
   */
  const sqlQuery = `
    SELECT * FROM user
    WHERE username = ?
  `;

  db.execute(sqlQuery, [username], async function (error, result) {
    if (error) {
      return response.status(500).send(error.sqlMessage);
    }

    /*
     * This checks if the query does not receive anything. The syntax of the query is correct but
     * no rows match the inputted data.
     */
    if (result.length === 0) {
      return response.status(404).send("Invalid credentials!");
    }

    /*
     * This checks and compares that the stored password and the inputted password are the same
     */
    const storedPassword = result[0].password;
    const isEqual = bcrypt.compareSync(password, storedPassword);

    if (!isEqual) {
      return response.status(404).send("Invalid credentials!");
    }

    /*
     * If the username and password is correct a copy of the users new information is made and sent through
     * the createAuthentication to create a cookie with the necessary information for other application queries.
     */
    const userCopy = { id: result[0].id, username: result[0].username };

    createAuthentication(response, userCopy);

    /*
     * The query has been successfully made!
     */
    response.status(200).send({ username });
  });
};
