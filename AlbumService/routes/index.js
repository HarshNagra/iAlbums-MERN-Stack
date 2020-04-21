var express = require('express');
var router = express.Router();

app.get('/init', function(req, res){
  if (req.cookies.userID) {
    res.send("");
  } else {
    res.sendFile( __dirname + "/public/" + "login.html" );
  } 
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'iAlbums' });
});

module.exports = router;
