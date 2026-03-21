var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hệ thống quản lý thư viện' });
});

module.exports = router;
