var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log("test:", req.session.passport.user);
  res.render('index', { title: 'depot'});
});

router.get('/login', function(req, res) {
  res.render('login');
});

module.exports = router;
