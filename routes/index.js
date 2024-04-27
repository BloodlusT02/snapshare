const mongoose = require("mongoose");
const upload = require("./multer");
var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const localStrategy = require("passport-local");
const passport = require("passport");


passport.use(new localStrategy(userModel.authenticate()));

// Post routes
// Register
router.post('/register', async function(req, res, next) {
  try {
    const { name, username, email } = req.body;
    const userData = new userModel({ name, username, email });
    userModel.register(userData, req.body.password)
      .then(() => {
        passport.authenticate("local")(req, res, function() {
          res.redirect("/profile");
        });
      });
  } catch (error) {
    console.error("Error in /register route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Login
router.post('/login', passport.authenticate("local", { successRedirect: "/profile", failureRedirect: "/login", failureFlash: true }), function(req, res, next) {
  // Handle any additional logic for login route
});

// Logout
router.get("/logout", function(req, res, next) {
  try {
    req.logout(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  } catch (error) {
    console.error("Error in /logout route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// File upload
router.post("/fileupload", isLoggedIn, upload.single("image"), async (req, res, next) => {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect("/profile");
  } catch (error) {
    console.error("Error in /fileupload route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// File upload
router.post("/createpost", isLoggedIn, upload.single("postimage"), async (req, res, next) => {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const postData = await postModel.create({
      user: user._id,
      title: req.body.posttitle,
      postImage: req.file.filename,
      description: req.body.description
    });
    user.posts.push(postData._id);
    await user.save();
    res.redirect("/profile");
  } catch (error) {
    console.error("Error in /createpost route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// isLoggedIn
function isLoggedIn(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  } catch (error) {
    console.error("Error in isLoggedIn middleware:", error);
    res.status(500).send("Internal Server Error");
  }
}

/* GET home page. */
router.get('/', (req, res, next) => {
  try {
    res.render('index');
  } catch (error) {
    console.error("Error in home page route: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {
  res.render('login', { error: req.flash('error') });
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user }).populate("posts");
    res.render('profile', { user });
  } catch (error) {
    console.error("Error in /profile route:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/feed', isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const posts = await postModel.find().populate("user");
    res.render('feed', { user, posts });
  } catch (error) {
    console.error("Error in /feed route:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/uploadpost', isLoggedIn, function(req, res, next) {
  res.render('postform');
});

router.get('/post/details', isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const { postId, userId } = req.query;
    const post = await postModel.findById(postId).populate("user");
    if (!post) {
      return res.status(404).send("Post is not found");
    }
    res.render('details', { post, user });
  } catch (error) {
    console.error("Error in /post/details route:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;