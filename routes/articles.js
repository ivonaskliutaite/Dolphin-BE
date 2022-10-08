const express = require('express');
const router = express.Router();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

/* GET users listing. */
router.get('/articles', async (req, res) => {
  const text = await fetch('http://www.delfi.lt')
      .then(r => r.text());

  const dom = new JSDOM(text);
  const result = Array.from(dom.window.document.querySelectorAll('.headline'))
      .filter(headlineEl => headlineEl.querySelector('.CBarticleTitle') != null)
      .map(headlineEl => {
        const articleNameAnchor = headlineEl.querySelector('.CBarticleTitle');
        const url = articleNameAnchor.getAttribute('href');
        const category = headlineEl.querySelector('.headline-category a');
        return {
          articleName: articleNameAnchor.text,
          url: url,
            category: category != null ? category.text : null
        }
      })
  // console.log(dom.window.document.querySelector("html").textContent);

  res.json(result);
});

router.get('/articles/:id', (req, res) => {
  res.json({ id: req.params.id});
});

module.exports = router;
