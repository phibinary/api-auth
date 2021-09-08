const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsyncErrors = require("../utils/errorHandlers/catchAsyncErrors");
const User = require("../models/user");
const users = require("../controllers/users");

router.route("/register").post(catchAsyncErrors(users.register));

router.route("/login").post(passport.authenticate("local"), users.login);

router.route("/verify").get(catchAsyncErrors(users.verify));

router.route("/:username/check").get(catchAsyncErrors(users.check));

router.get("/logout", users.logout);

module.exports = router;
