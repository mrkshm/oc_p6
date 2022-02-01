const Joi = require("joi");

//
// Schemas
//
const userSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(5).required()
});

const sauceSchema = Joi.object({
  userId: Joi.string().alphanum().length(24),
  name: Joi.string().min(3).max(30).trim().required(),
  manufacturer: Joi.string().min(3).max(50).trim().required(),
  description: Joi.string().min(3).max(150).trim().required(),
  mainPepper: Joi.string().min(3).max(15).trim().required(),
  heat: Joi.number().integer().min(1).max(10).required()
});

//
// Validation methods
//
const userValidator = async (req, res, next) => {
  try {
    const value = await userSchema.validateAsync({
      email: req.body.email,
      password: req.body.password
    });
    req.body.cleanUser = value;
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      message: err.message
    });
  }
  next();
};

const sauceValidator = async (req, res, next) => {
  let sauce;
  if (req.body.sauce) {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(sauceObject);
    sauce = {
      userId: sauceObject.userId,
      name: sauceObject.name,
      manufacturer: sauceObject.manufacturer,
      description: sauceObject.description,
      mainPepper: sauceObject.mainPepper,
      heat: sauceObject.heat
    };
  } else {
    sauce = {
      userId: req.body.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      heat: req.body.heat
    };
  }
  try {
    const value = await sauceSchema.validateAsync({
      userId: sauce.userId,
      name: sauce.name,
      manufacturer: sauce.manufacturer,
      description: sauce.description,
      mainPepper: sauce.mainPepper,
      heat: sauce.heat
    });
    req.body.cleanSauce = value;
  } catch (err) {
    return res.status(400).json({
      message: "Please check your input"
    });
  }

  next();
};

module.exports = {
  sauceValidator,
  userValidator
};
