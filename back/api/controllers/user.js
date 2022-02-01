const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//
// POST api/auth/signup
//
exports.signup = (req, res, next) => {
  //
  // req.body.cleanUser from ../middleware/validator.js:
  // email, password
  //
  const email = req.body.cleanUser.email;
  //
  // Checking if user has already an account
  //
  if (User.findOne({ email: email })) {
    return res
      .status(400)
      .json({ message: "Un compte avec cette adresse email existe déjà." });
  }
  //
  // If not, continue: encrypt password and save user
  //
  bcrypt
    .hash(req.body.cleanUser.password, 10)
    .then(hash => {
      const user = new User({
        email: email,
        password: hash
      });
      user
        .save()
        .then(() => res.status(201).json({ messge: "Utilisateur crée !" }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//
// POST api/auth/login
//
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
              expiresIn: "24h"
            })
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
