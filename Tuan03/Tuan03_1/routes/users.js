var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Danh sách người dùng đang được cập nhật.');
});

module.exports = router;
