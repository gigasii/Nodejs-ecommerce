// Third-party packages
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

// Core packages
const crypto = require("crypto");

// Imports
const User = require("../models/user");

// Constants
const SENDER_EMAIL = "pokemon2856@gmail.com";

// Intialization
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: { api_key: `${process.env.SENDGRID_API_KEY}` },
  })
);

function getFlash(req, field) {
  // Once a flash variable is retrived, it is removed from the session
  let message = req.flash(field);

  if (message.length > 0) {
    return message[0];
  }

  return null;
}

exports.getLogIn = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: getFlash(req, "error"),
  });
};

exports.postLogIn = (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    // Email doesnt match
    if (!user) {
      req.flash("error", "Invalid email");
      return res.redirect("/login");
    }
    // Email matches, continue to comparing password
    bcrypt.compare(req.body.password, user.password).then((match) => {
      // Password matches
      if (match) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(() => {
          res.redirect("/");
        });
      }
      // Password doesnt match
      req.flash("error", "Invalid password");
      res.redirect("/login");
    });
  });
};

exports.postLogOut = (req, res, next) => {
  // Destroy all session variables
  req.session.destroy(() => res.redirect("/"));
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: getFlash(req, "error"),
  });
};

exports.postSignUp = (req, res, next) => {
  // Build-in validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
    });
  }

  // Custom validation, if successful, create user
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      req.flash("error", "Email already exists");
      return res.redirect("/signup");
    }

    if (req.body.password != req.body.confirmPassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/signup");
    }

    // Hash password
    bcrypt
      .hash(req.body.password, 12)
      .then((hashedPw) => {
        // New user
        const newUser = new User({
          email: req.body.email,
          password: hashedPw,
          cart: { products: [] },
        });
        return newUser.save();
      })
      .then(() => {
        // Send confirmation email
        transporter.sendMail({
          to: req.body.email,
          from: SENDER_EMAIL,
          subject: "Sign up confirmation",
          html: "<h1>You have successfully signed up.</h1>",
        });
        res.redirect("/login");
      });
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reseet",
    pageTitle: "Reset",
    errorMessage: getFlash(req, "error"),
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        req.flash("error", "No account with that email found");
        return res.redirect("/reset");
      }
      user.resetToken = token;
      // Specify in milliseconds
      user.resetTokenExpiration = Date.now() + 3600000;
      user.save().then(() => {
        transporter.sendMail({
          to: req.body.email,
          from: SENDER_EMAIL,
          subject: "Password reset",
          html: `
                    <p>You requested a password reset</p>
                    <a href="http://localhost:3000/reset/${token}">Click here to change password</a>
                    `,
        });
        res.redirect("/products");
      });
    });
  });
};

exports.getNewPassword = (req, res, next) => {
  User.findOne({
    resetToken: req.params.token,
    resetTokenExpiration: { $gt: Date.now() },
  }).then((user) => {
    res.render("auth/new-password", {
      path: "/newpassword",
      pageTitle: "New password",
      errorMessage: getFlash(req, "error"),
      user: user,
    });
  });
};

exports.postNewPassword = (req, res, next) => {
  User.findOne({ resetToken: req.body.passwordToken }).then((user) => {
    bcrypt
      .hash(req.body.password, 12)
      .then((hashedPw) => {
        user.password = hashedPw;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        return user.save();
      })
      .then(() => res.redirect("/login"));
  });
};
