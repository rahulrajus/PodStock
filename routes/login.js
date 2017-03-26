var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.sendFile("../authentication/login.html");
  console.log("done login")
});

module.exports = router;
