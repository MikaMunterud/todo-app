const joi = require("joi");

exports.validateUsernamePassword = function (requestBody) {
  const postSchema = joi.object({
    username: joi.string().min(3).max(50).required(),
    password: joi.string().min(6).max(50).required(),
  });

  return postSchema.validate(requestBody);
};
