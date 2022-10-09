const express = require('express');
const router = express.Router();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('sync-fetch');

const getAllArticles = () => {
  const delfiHomepageAsPlainText = fetch('https://www.delfi.lt').text();
  const delfiHomepageDOM = new JSDOM(delfiHomepageAsPlainText).window.document;

  const allArticleEls = delfiHomepageDOM.querySelectorAll('.headline')
  const allArticlesAssArray = Array.from(allArticleEls)
  const allArticles = allArticlesAssArray
      .filter(articleDomEl => articleDomEl.querySelector('.CBarticleTitle')?.text)
      .map(articleElement => {
        const anchorEl = articleElement.querySelector('.CBarticleTitle')
        const articleUrl = new URL(anchorEl.href)
        return {
          title: anchorEl.text,
          url: anchorEl.href,
          id: parseInt(articleUrl.searchParams.get('id'))
        }
      })

  return allArticles;
}

const getArticleById = (id) => {
    const url = 'https://www.delfi.lt/'+id;

    const delfiHomepageAsPlainText = fetch(url).text();
    const delfiHomepageDOM = new JSDOM(delfiHomepageAsPlainText).window.document;

    const articleTitle = delfiHomepageDOM.querySelector('.article-title h1').textContent.trim()
    const articleSummary = delfiHomepageDOM.querySelector('.delfi-article-lead').textContent.trim()
    const articleContent = Array.from(delfiHomepageDOM.querySelectorAll('.row .col-xs-8 p')).map(x => x.textContent.trim())
        .filter(t => t.length !== 0)

    return {
        id : id,
        title : articleTitle,
        summary : articleSummary,
        content : articleContent
    }
}

/* GET users listing. */
router.get('/articles',  (req, res) => {
  res.json(getAllArticles());
});



router.get('/articles/:id', (req, res) => {
  res.json(getArticleById(req.params.id));
});

module.exports = router;
