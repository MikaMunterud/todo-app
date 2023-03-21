const joi = require("joi");

exports.validatePassword = function (requestBody) {
  const postSchema = joi.object({
    password: joi.string().min(6).max(50).required(),
  });
  return postSchema.validate(requestBody);
};
