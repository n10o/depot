var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var PropSchema = new Schema({
  ownerId: String,
  title: String,
  author: String,
  isbn: String,
  publisher: String,
  productGroup: String,
  asin: String,
  detailPageURL: String,
  smallImage: String,
  mediumImage: String,
  largeImage: String,
  date: {type: Date, default: Date.now}
});
var Prop = mongoose.model('Prop', PropSchema);

router.get('/:ownerId?', function(req, res){
  var ownerId = req.params.ownerId;
  Prop.find({ownerId: ownerId}, function(err, result){
    res.json(result);
  });
});

// TODO reconsider url naming
router.get('/item/:objectId', function(req, res){
  var objectId = req.params.objectId;
  Prop.find({_id: objectId}, function(err, result){
    res.json(result);
  });
});

router.post('/', function(req, res){
  var ownerId = req.session.passport.user.id;
  var title = req.body.Title;
  var author = req.body.Author;
  var isbn = req.body.ISBN;
  var publisher = req.body.Publisher;
  var productGroup = req.body.ProductGroup;
  var asin = req.body.ASIN;
  var detailPageURL = req.body.DetailPageURL;
  var smallImage = req.body.SmallImage;
  var mediumImage = req.body.MediumImage;
  var largeImage = req.body.LargeImage;
  var item = new Prop({
    ownerId: ownerId,
    title: title,
    author: author,
    isbn: isbn,
    publisher: publisher,
    productGroup: productGroup,
    asin: asin,
    detailPageURL: detailPageURL,
    smallImage: smallImage,
    mediumImage: mediumImage,
    largeImage: largeImage
  });
  item.save(function(err){
    if (err){
      console.log("ERROR save");
    }
  });
  res.status(200).end();
});

router.delete('/:ownerId/:objectId', function(req, res){
  var ownerId = req.params.ownerId;
  var objectId = req.params.objectId;
  Prop.findOneAndRemove({ _id: objectId, ownerId: ownerId}, function(err){
    if(err){
      console.log("DELETE FAILED", err);
    }
  });
  res.status(200).end();
});

module.exports = router;
