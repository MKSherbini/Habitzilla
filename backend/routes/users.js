const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//Get All users
router.get("/", userController.getUsers);
router.get("/:username", userController.getUser);
router.post("/", userController.addUser);

module.exports = router;