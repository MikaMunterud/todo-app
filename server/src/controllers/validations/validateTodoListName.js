const joi = require("joi");

exports.validateTodoListName = function (requestBody) {
  const postSchema = joi.object({
    name: joi.string().min(3).max(50).required(),
  });

  return postSchema.validate(requestBody);
};
