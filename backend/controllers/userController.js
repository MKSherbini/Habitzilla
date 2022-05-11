const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getUser = (req, res, next) => {
  User.find({ username: req.params.username })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => {
      next(error);
    });
};

exports.addUser = (req, res, next) => {
  console.log(req.body);
  let hashedPassword = bcrypt.hashSync(req.body.password, 10);
  let user = new User({ ...req.body, password: hashedPassword });

  user
    .save()
    .then((data) => {
      res.status(201).json({ message: "user added", data });
    })
    .catch((error) => next(error));
};
