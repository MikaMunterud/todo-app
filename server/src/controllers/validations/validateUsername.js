const joi = require("joi");

exports.validateUsername = function (requestBody) {
  const postSchema = joi.object({
    username: joi.string().min(3).max(50).required(),
  });

  return postSchema.validate(requestBody);
};
