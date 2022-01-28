const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    // name: sauceObject.name,
    // manufacturer: sauceObject.manufacturer,
    // description: sauceObject.description,
    // mainPepper: sauceObject.mainPepper,
    // description: sauceObject.description,
    // heat: sauceObject.heat,
    ...sauceObject,
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

exports.modifySauce = (req, res, next) => {
  let oldImage;
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then(oldSauce => {
        oldImage = oldSauce.imageUrl.split("/images/")[1];
        // console.log(req.file);
        // fs.unlink(`images/${oldImage}`, () => {});
      })
      .catch(error => res.status(400).json({ error }));
  }

  const sauceObject = req.file
    ? {
        // put new image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`
      }
    : { ...req.body };

  let dongus = 3;
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => {
      fs.unlink(`images/${oldImage}`, () => {});
      return res
        .status(200)
        .json({ message: "La sauce était bien modifiée !" });
    })
    .catch(error => res.status(400).json({ error }));
};

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

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};
