var express = require('express');
var router = express.Router();
var config = require('../config');
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: "/auth/facebook/callback"
  }, function(accessToken, refreshToken, profile, done){
    // TODO
    if(!profile){
      console.log("Fail FB login");
    }
    console.log("Success FB login:", + profile);
    console.log("Success FB login:", + accessToken);
    console.log("Success FB login:", + refreshToken);
    // TODO?
    process.nextTick(function(){
      return done(null, profile); 
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

router.get('/facebook', passport.authenticate('facebook'));
// TODO
router.get('/facebook/callback', passport.authenticate('facebook', {successRedirect: '/',
          failureRedirect: '/fail'}));

router.get('/logout/', function(req, res){
  req.logout();
});

module.exports = router;
