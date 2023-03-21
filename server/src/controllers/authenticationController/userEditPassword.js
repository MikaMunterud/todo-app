const { db } = require("../../database");
const bcrypt = require("bcrypt");
const { validatePassword } = require("../validations/validatePassword");

exports.userEditPassword = function (request, response) {
  /*
   * This validates the request body that the user has inputted
   */
  const validatedUser = validatePassword(request.body);

  if (validatedUser.error) {
    return response.status(400).send(validatedUser.error.details[0].message);
  }

  /*
   * This obtains the users current data stored in the cookie and the data from the validated result.
   */
  const loggedInUserID = request.loggedInUser.id;
  const { username } = request.loggedInUser;
  const { password } = validatedUser.value;

  /*
   * The new password is hashed so it can be securely stored in the database by using bcrypt.
   */
  const securePassword = bcrypt.hashSync(password, 10);

  /*
   * If the user wants to edit only their password, the below query will be made.
   */
  const sqlQuery = `
      UPDATE user
      SET password = ?
      WHERE id = ?
    `;

  db.execute(
    sqlQuery,
    [securePassword, loggedInUserID],
    function (error, result) {
      if (error) {
        return response.status(500).send(error.sqlMessage);
      }

      /*
       * The query has been successfully made!
       */
      response
        .status(200)
        .send(`Password has been changed, for username ${username}!`);
    }
  );
};
