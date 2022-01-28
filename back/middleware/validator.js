const { body, validationResult } = require("express-validator");
const userValidationRules = () => {
  return [
    // Rules for user validation
    body("email").isEmail(),
    body("password").isLength({ min: 5 })
  ];
};

// const sauceValidationRules = () => {
//   return [
//     // Rules for sauce validation
//     body("heat").isNumeric(),
//     body("likes").isNumeric(),
//     body("dislikes").isNumeric()
//   ];
// };

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors
  });
};

module.exports = {
  // sauceValidationRules,
  userValidationRules,
  validate
};
