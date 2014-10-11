var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var PropSchema = new Schema({
  ownerId: String,
  title: String,
  asin: String,
  imageURL: String,
  date: {type: Date, default: Date.now}
});
var Prop = mongoose.model('Prop', PropSchema);

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
  imageURL = req.body.ImageURL;
  url = req.body.URL;
  var item = new Prop({
    ownerId: ownerId,
    title: title,
    asin: asin,
    imageURL: imageURL
  });
  item.save(function(err){
    if (err){
      console.log("ERROR save");
    }
  });
  res.status(200).end();
});

router.delete('/:ownerId/:objectId', function(req, res){
  ownerId = req.params.ownerId;
  objectId = req.params.objectId;
  Prop.findOneAndRemove({ _id: objectId, ownerId: ownerId}, function(err){
    if(err){
      console.log("DELETE FAILED", err);
    }
  });
  res.status(200).end();
});

module.exports = router;
