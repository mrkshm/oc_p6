const Sauce = require("../api/models/Sauce");

const ownsSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId !== req.auth.userId) {
        return res
          .status(401)
          .json({ message: "You are not allowed to do that" });
      }
      next();
    })
    .catch(error => {
      res.status(400).json({ message: "Sauce not found" });
    });
};

module.exports = ownsSauce;
