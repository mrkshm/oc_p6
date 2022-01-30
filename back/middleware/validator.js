const { body, validationResult } = require("express-validator");
const userValidationRules = () => {
  return [
    // Rules for user validation
    body("email").isEmail(),
    body("password").isLength({ min: 5 })
  ];
};

const sauceValidationRules = () => {
  return [
    // Rules for sauce validation
    // but how do I get to info
    // that is in an Object ???
    body("name").isAlpha(),
    body("manufacturer").isNumeric(),
    body("description").isNumeric(),
    body("mainPepper").isNumeric(),
    body("heat").isNumeric()
  ];
};

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
  sauceValidationRules,
  userValidationRules,
  validate
};
