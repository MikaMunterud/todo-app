const joi = require("joi");

exports.validateTaskEditDone = function (requestBody) {
  const postSchema = joi.object({
    todoListName: joi.string().min(3).max(50).required(),
    currentDescription: joi.string().min(3).max(255).required(),
    done: joi.string().valid(true, false).required(),
    friend: joi.string().min(3).max(50),
  });

  return postSchema.validate(requestBody);
};
