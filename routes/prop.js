var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/depot');

var PropSchema = new Schema({
  title: String,
  asin: String,
  date: {type: Date, default: Date.now}
});
var Prop = mongoose.model('Prop', PropSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to depot database");
});

router.get('/', function(req, res){
  console.log("GET / SUCCEED");
  Prop.find(function(err, result){
    res.json(result);
  });
});

router.post('/', function(req, res){
  console.log("POST / SUCCEED");
  asin = req.body.ASIN;
  title = req.body.Title;
  image = req.body.imageURL;
  url = req.body.URL;
  var item = new Prop({
    title: title,
    asin: asin
  });
  item.save(function(err){
    if (err){
      console.log("ERROR save");
    }
    console.log(title + " saved");
  });
  res.send("SUCCESS SAVE");
});

module.exports = router;
