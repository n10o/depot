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
  memo: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  }
});
var Prop = mongoose.model('Prop', PropSchema);

router.get('/:ownerId?', function(req, res) {
  var ownerId = req.params.ownerId;
  Prop.find({
    ownerId: ownerId
  }, function(err, result) {
    res.json(result);
  });
});

// TODO reconsider url naming
router.get('/item/:objectId', function(req, res) {
  var objectId = req.params.objectId;
  Prop.find({
    _id: objectId
  }, function(err, result) {
    if (err) {
      res.status(500);
      res.send("No item found");
    }
    res.json(result);
  });
});

router.post('/', function(req, res) {
  var ownerId = req.session.passport.user.id;
  var isbn = req.body.isbn;
  Prop.find({
    ownerId: ownerId,
    isbn: isbn
  }, function(err, result) {
    // Prevent duplicate
    if (result.length == 0) {
      var title = req.body.title;
      var author = req.body.author;
      var publisher = req.body.publisher;
      var productGroup = req.body.productGroup;
      var asin = req.body.asin;
      var detailPageURL = req.body.detailPageURL;
      var smallImage = req.body.smallImage;
      var mediumImage = req.body.mediumImage;
      var largeImage = req.body.largeImage;
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
      item.save(function(err) {
        if (err) {
          console.log("ERROR save");
        }
      });
    }else{
      // TODO: BUG detail画面でメモを消した時に保存されない、単純に保存すると検索からduplicate登録した時にメモが消える
      var memo = req.body.memo;
      if(memo){
        Prop.update({
          ownerId: ownerId,
          isbn: isbn
        }, {$set:{"memo": memo}}, function(err, result){
          if(err){
            console.log("UPDATE ERROR:", err);
          }
        });
      }
    }
  });
  res.status(200).end();
});

router.delete('/:ownerId/:objectId', function(req, res) {
  var ownerId = req.params.ownerId;
  var objectId = req.params.objectId;
  Prop.findOneAndRemove({
    _id: objectId,
    ownerId: ownerId
  }, function(err) {
    if (err) {
      console.log("DELETE FAILED", err);
    }
  });
  res.status(200).end();
});

module.exports = router;
