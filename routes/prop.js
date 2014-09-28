var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var PropSchema = new Schema({
  ownerId: String,
  title: String,
  asin: String,
  date: {type: Date, default: Date.now}
});
var Prop = mongoose.model('Prop', PropSchema);

// router.get('/', function(req, res){
//   Prop.find(function(err, result){
//     res.json(result);
//   });
// });

router.get('/:ownerId?', function(req, res){
  var ownerId = req.params.ownerId;
  Prop.find({ownerId: ownerId}, function(err, result){
    res.json(result);
  });
});

router.post('/', function(req, res){
  ownerId = req.session.passport.user.id;
  asin = req.body.ASIN;
  title = req.body.Title;
  image = req.body.imageURL;
  url = req.body.URL;
  var item = new Prop({
    ownerId: ownerId,
    title: title,
    asin: asin
  });
  item.save(function(err){
    if (err){
      console.log("ERROR save");
    }
  });
  res.status(200).end();
});

module.exports = router;
