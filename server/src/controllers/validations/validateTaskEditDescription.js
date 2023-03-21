const joi = require("joi");

exports.validateTaskEditDescription = function (requestBody) {
  const postSchema = joi.object({
    todoListName: joi.string().min(3).max(50).required(),
    currentDescription: joi.string().min(3).max(255).required(),
    newDescription: joi.string().min(3).max(255).required(),
    friend: joi.string().min(3).max(50),
  });

  return postSchema.validate(requestBody);
};
