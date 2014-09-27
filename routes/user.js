var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  id: String,
  name: String,
  fbid: String,
  gender: String
});

var User = mongoose.model('User', UserSchema);

// TODO this function set common
var auth = function(req, res, next){
  console.log(req);
  if(!req.isAuthenticated()){
    res.send(401);
  }else{
    next();
  }
}

router.get('/:id?', auth, function(req, res){
  var id = req.params.id;
  if(!id){
    User.find(function(err, result){
      res.json(result);
    });
  }else{
    User.findById(id, function(err, result){
      res.send(result);
    });
  }
});

router.post('/', function(req, res){
  name = req.body.name;
  fbid = req.body.fbid;
  gender = req.body.gender;
  console.log(name);
  var user = new User({
    // TODO
    id: Math.floor( Math.random() * 100 ) + 1,
    name: name,
    fbid: fbid,
    gender: gender
  });
  user.save();
  res.send("SUCCESS POST user/");
});


module.exports = router;
