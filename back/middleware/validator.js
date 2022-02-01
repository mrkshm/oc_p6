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
  let dirtySauce;
  if (req.body.sauce) {
    dirtySauce = JSON.parse(req.body.sauce);
  } else {
    dirtySauce = { ...req.body };
  }
  try {
    const cleanSauce = await sauceSchema.validateAsync({
      userId: dirtySauce.userId,
      name: dirtySauce.name,
      manufacturer: dirtySauce.manufacturer,
      description: dirtySauce.description,
      mainPepper: dirtySauce.mainPepper,
      heat: dirtySauce.heat
    });
    req.body.cleanSauce = cleanSauce;
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }

  next();
};

module.exports = {
  sauceValidator,
  userValidator
};
