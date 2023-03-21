const joi = require("joi");

exports.validateTodoListNames = function (requestBody) {
  const postSchema = joi.object({
    currentName: joi.string().min(3).max(50).required(),
    name: joi.string().min(3).max(50).required(),
  });

  return postSchema.validate(requestBody);
};
