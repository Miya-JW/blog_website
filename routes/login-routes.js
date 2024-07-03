const express = require("express");
const router = express.Router();
const userDao = require("../modules/users-dao");

router.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

router.get("/login", async function (req, res) {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.locals.message = req.query.message;
    res.render("login");
  }
});

router.post("/login", async function (req, res) {
  // Get the username and password submitted in the form
  const username = req.body.username;
  const password = req.body.password;
  // console.log(username,password);

  // Find a matching user in the database
  const user = await userDao.retrieveUserWithCredentials(username, password);
  // if there is a matching user...
  if (user) {
    // Auth success - add the user to the session, and redirect to the homepage.
    req.session.user = user;
    res.redirect("/");
  }

  // Otherwise, if there's no matching user...
  else {
    // Auth fail
    res.redirect("./login?message=Login failed!");
  }
});

router.get("/logout", function (req, res) {
  if (req.session.user) {
    delete req.session.user;
  }

  res.redirect("./login?message=Successfully logged out!");
});

router.get("/newAccount", function (req, res) {
  res.locals.message = req.query.message;
  res.render("profile");
});
router.post("/newAccount", function (req, res) {
  const password = req.body.password;
  const password_repeat = req.body.password_repeat;
  if (password == password_repeat) {
    const user = {
      userName: req.body.userName,
      password: req.body.password,
    };

    userDao
      .createUser(user)
      .then((newUser) => {
        req.session.user = newUser[0];
        res.redirect("./profile");
      })
      .catch((err) => {
        console.error(err);
        res.redirect("./login?show=register&message=Error creating account.");
      });
  } else {
    res.redirect("./login?show=register&message=Passwords do not match.");
  }
});

router.get("/check-username", async (req, res) => {
  const username = req.query.username;
  const userExists = await userDao.checkUserExists(username);
  res.json({ exists: userExists });
});

module.exports = router;
