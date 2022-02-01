const Sauce = require("../models/Sauce");
const fs = require("fs");

//
// POST api/sauces/
//
exports.createSauce = (req, res, next) => {
  const sauce = new Sauce({
    //
    // req.body.cleanSauce from ../middleware/validator.js:
    // userId, name, manufacturer, description, mainPepper, heat
    //
    ...req.body.cleanSauce,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch(error => {
      res.status(400).json({ error });
    });
};

//
// PUT /api/sauces/:id
//
exports.modifySauce = (req, res, next) => {
  //
  // Get name of the old image if there is a file in req
  let oldImage;
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then(oldSauce => {
        oldImage = oldSauce.imageUrl.split("/images/")[1];
      })
      .catch(error => res.status(400).json({ error }));
  }

  // Create the Sauce object to be saved...
  const sauceObject = req.file
    ? {
        // If there is an image file,
        // populate the sauceObject...
        ...req.body.cleanSauce,
        //
        // ... and put in new imageUrl
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`
      }
    : // If there is no image file, just populate the sauceObject
      { ...req.body.cleanSauce };

  //
  // Save the updated sauce
  //
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => {
      // If everything went well, delete the old image file
      fs.unlink(`images/${oldImage}`, () => {});
      return res
        .status(200)
        .json({ message: "La sauce était bien modifiée !" });
    })
    .catch(error => res.status(400).json({ error }));
};

//
// DELETE /api/sauces/:id
//
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId !== req.auth.userId) {
        res.status(400).json({ error });
      }
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({
              message: "Votre sauce a été supprimée !"
            });
          })
          .catch(error => {
            res.status(400).json({ error });
          });
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//
// POST /api/sauces/:id/like
//
exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;
  console.log(like, userId);
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (like === 1) {
        if (sauce.usersLiked.includes(userId)) {
          console.log("Vous avez déjà aimé cette sauce !");
          return res
            .status(501)
            .json({ message: "Vous avez déjà aimé cette sauce !" });
        } else {
          sauce.usersLiked.push(userId);
          sauce.likes += 1;
          // console.log(sauce.usersLiked, " and ", sauce.likes);
          Sauce.updateOne(
            { _id: req.params.id },
            { likes: sauce.likes, usersLiked: sauce.usersLiked }
          )
            .then(() => res.status(200).json({ message: "All is ok" }))
            .catch(error => res.status(501).json({ error }));
        }
      } else if (like === 0) {
        // console.log("Neither liked not disliked");
        if (sauce.usersLiked.includes(userId)) {
          sauce.likes -= 1;
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
          Sauce.updateOne(
            { _id: req.params.id },
            { likes: sauce.likes, usersLiked: sauce.usersLiked }
          )
            .then(() => res.status(200).json({ message: "All is ok" }))
            .catch(error => res.status(501).json({ error }));
        } else if (sauce.usersDisliked.includes(userId)) {
          sauce.dislikes -= 1;
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
          Sauce.updateOne(
            { _id: req.params.id },
            { dislikes: sauce.dislikes, usersDisliked: sauce.usersDisliked }
          )
            .then(() => res.status(200).json({ message: "All is ok" }))
            .catch(error => res.status(501).json({ error }));
        }
        // return res.status(200).json({ message: "All is ok" });
      } else if (like == -1) {
        if (sauce.usersLiked.includes(userId)) {
          console.log("Vous n'avez déjà pas aimé la sauce !");
        } else {
          sauce.usersDisliked.push(userId);
          sauce.dislikes += 1;
          Sauce.updateOne(
            { _id: req.params.id },
            { dislikes: sauce.dislikes, usersDisliked: sauce.usersDisliked }
          )
            .then(() => res.status(200).json({ message: "All is ok" }))
            .catch(error => res.status(501).json({ error }));
        }
      }
    })
    .catch();
  // Get sauce with req.params.id
  // if user likes (1) {
  // if user already in liked, do nothing
  // else add to liked, likes + 1
  // }
  // if user dislikes (-1) {
  // if user already in disliked, do nothing
  // else add to disliked, dislikes + 1
  // if user 0 : if user in disliked, remove from disliked, dislikes -1
  // else if user in liked, remove from liked, likes -1
  // }
  // return res.status(200).json({
  // message: "You like this sauce !"
  // });
};

//
// GET /api/sauces/:id
//
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//
// GET /api/sauces
//
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};
