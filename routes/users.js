var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(' you are at user router -respond with a resource');
});


module.exports = router;
