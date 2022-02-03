const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//
// POST api/auth/signup
//
exports.signup = (req, res, next) => {
  // req.body.cleanUser from ../middleware/validator.js:
  // email, password
  const email = req.body.cleanUser.email;
  //
  // Checking if user has already an account, if yes send error
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        return res
          .status(400)
          .json({ message: "A user with this email address already exists" });
      }
      // hash password and create account
      bcrypt
        .hash(req.body.cleanUser.password, 10)
        .then(hash => {
          const user = new User({
            email: email,
            password: hash
          });
          user
            .save()
            .then(() => res.status(201).json({ messge: "User created" }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));

  //   if (User.findOne({ email: email })) {
  //     return res
  //       .status(400)
  //       .json({ message: "Un compte avec cette adresse email existe déjà." });
  //   }
  //   bcrypt
  //     .hash(req.body.cleanUser.password, 10)
  //     .then(hash => {
  //       const user = new User({
  //         email: email,
  //         password: hash
  //       });
  //       user
  //         .save()
  //         .then(() => res.status(201).json({ messge: "Utilisateur crée !" }))
  //         .catch(error => res.status(400).json({ error }));
  //     })
  //     .catch(error => res.status(500).json({ error }));
};

//
// POST api/auth/login
//
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "Email or Password incorrect" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res
              .status(401)
              .json({ error: "Email or Password incorrect" });
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
