var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'depot'});
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/item/:itemid', function(req, res) {
//  var itemid = req.params.itemid;
//  var itemid = req.itemid;
//  console.log(itemid);
  res.render('item');
});

module.exports = router;
