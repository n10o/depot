var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'depot'});
});

router.get('/watch', function(req, res){
  res.render('watch');
});

router.get('/search', function(req, res){
  res.render('search');
});

router.get('/login', function(req, res) {
  res.render('login');
});

// TODO nodeからjadeを返す方式にしているが、直接angularからアクセスできないか
//
router.get('/item/:itemid', function(req, res) {
  var itemid = req.params.itemid;
//  var itemid = req.itemid;
  console.log(itemid);
  res.render('item', { itemid: itemid });
});

module.exports = router;
