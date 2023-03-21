const joi = require("joi");

exports.validateTodoListParams = function (requestBody) {
  const postSchema = joi.object({
    todoListName: joi.string().min(3).max(50).required,
    username: joi.string().min(3).max(50).required,
  });

  return postSchema.validate(requestBody);
};
