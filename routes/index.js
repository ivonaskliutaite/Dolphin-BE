let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/articles', function(req, res, next) {
  res.render('articles', { title: 'ytfuytfuyfuy' });
});

module.exports = router;
