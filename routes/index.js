// server framework
var express = require('express');
var router = express.Router();

// get homepage
router.get('/', function(req,res, next) {
    res.render('index', {title: "myApp"});
});

module.exports = router;