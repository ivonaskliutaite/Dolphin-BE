let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/articles', (req, res) => {
  res.send(res.json([]));
})

router.get('/articles/:id', (req, res) => {
  res.json({ id: req.params.id});
})

module.exports = router;
