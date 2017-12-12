var express = require("express");
var router = express.Router();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const facebook = require("../facebook_credentials.json");
const models = require("../models/");
const User = models.User;

passport.use(
  new FacebookStrategy(
    {
      clientID: facebook.appId,
      clientSecret: facebook.appSecret,
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log("----- All that shit -----");
      console.log(accessToken, refreshToken, profile);
      const facebookId = profile.id;
      const displayName = profile.displayName;

      console.log(profile);
      User.findOne({ facebookId }, function(err, user) {
        if (err) return done(err);

        if (!user) {
          // Create a new account if one doesn't exist
          user = new User({ facebookId, displayName });
          user.save((err, user) => {
            if (err) return done(err);
            done(null, user);
          });
        } else {
          // Otherwise, return the extant user.
          done(null, user);
        }
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.get("/", passport.authenticate("facebook"));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);
module.exports = router;
