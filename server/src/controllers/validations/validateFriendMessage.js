const joi = require("joi");

exports.validateFriendMessage = function (requestBody) {
  const postSchema = joi.object({
    friend: joi.string().min(3).max(50).required(),
    message: joi.string().valid("approved", "rejected").required(),
  });

  return postSchema.validate(requestBody);
};
