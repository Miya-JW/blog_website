const express = require("express");
const router = express.Router();
const userDao = require("../modules/users-dao");
const { locals } = require("express/lib/application");

router.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

router.get("/profile", async function (req, res) {
  if (req.session.user) {
    res.render("profile");
  } else {
    res.redirect("./login?message=Please log in to peek at your profile.");
  }
});

router.post("/update-profile", async function (req, res) {
  const { field, value } = req.body;
  if (field == "userName") {
    const exist = await userDao.checkUserExists(value);
    if (exist == false) {
      try {
        const newUser = await userDao.updateUserProfile(
          req.session.user.user_id,
          field,
          value
        );
        req.session.user = newUser;
        return res.json({ message: "Profile updated successfully" });
      } catch (error) {
        return res.status(500).send(error.message);
      }
    } else {
      return res.json({ message: "Profile updated failed" });
      return res.status(409).json({ message: "Username already exists" });
    }
  } else {
    try {
      const newUser = await userDao.updateUserProfile(
        req.session.user.user_id,
        field,
        value
      );
      req.session.user = newUser;
      return res.json({ message: "Profile updated successfully" });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
});

router.post("/verify-password", async (req, res) => {
  const user_id = req.session.user.user_id;
  const password = req.body.password;
  // password verification
  const isValid = await userDao.verifyUserPassword(user_id, password);
  if (isValid) {
    res.json({ isValid: true });
  } else {
    res.json({ isValid: false });
  }
});

router.post("/delete-account", async (req, res) => {
  const user_id = req.body.user_id;
  console.log(`routes${user_id}`);

  const isDeleted = await userDao.deleteUser(user_id);
  if (isDeleted) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.json({ isValid: false });
      } else {
        res.json({ isValid: true });
      }
    });
  } else {
    res.json({ isValid: false });
  }
});

module.exports = router;
