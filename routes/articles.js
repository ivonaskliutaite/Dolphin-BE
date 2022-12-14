const express = require('express');
const router = express.Router();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('sync-fetch');
// passport +
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();
// passport -

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
        const articleCategory = articleElement.querySelector('.headline-category a')?.textContent || null
        return {
          title: anchorEl.text,
          url: anchorEl.href,
          id: parseInt(articleUrl.searchParams.get('id')),
            category: articleCategory
        }
      })
  return allArticles;
}

const getArticleById = (id) => {
    const url = 'https://www.delfi.lt/'+id;

    const delfiHomepageAsPlainText = fetch(url).text();
    const delfiHomepageDOM = new JSDOM(delfiHomepageAsPlainText).window.document;

    const articleCategory = delfiHomepageDOM.querySelector('.headline-category').textContent.trim()
    const articleTitle = delfiHomepageDOM.querySelector('.article-title h1').textContent.trim()
    const articleSummary = delfiHomepageDOM.querySelector('.delfi-article-lead').textContent.trim()
    const articleContent = Array.from(delfiHomepageDOM.querySelectorAll('.row .col-xs-8 p')).map(x => x.textContent.trim())
        .filter(t => t.length !== 0)

    return {
        id : id,
        title : articleTitle,
        summary : articleSummary,
        content : articleContent,
        category : articleCategory
    }
}

router.get('/articles/saved', ensureLoggedIn, ((req, res) => {
    const result = Object.values(DB).map(r => {
        return {
            id: r.id,
            title: r.title
        }
    })
    res.json(result)
}))

router.delete('/articles/saved/:id', ensureLoggedIn, ((req, res) => {
    delete DB[req.params.id];
    res.json();
}))

/* GET users listing. */
router.get('/articles', ensureLoggedIn, (req, res, next) => {
    res.json(getAllArticles());
});

router.get('/articles/:id', ensureLoggedIn, (req, res) => {
    if (DB[req.params.id]) {
        console.log(`Return article ${req.params.id} from db`);
        return res.json(DB[req.params.id]);
    }
    res.json(getArticleById(req.params.id));
});

let DB = {}

router.put('/articles/:id', ensureLoggedIn, ((req, res) => {
    DB[req.body.id] = req.body
        console.log(DB)
    res.json({
        id: req.params.id,
        body: req.body
    });
    }
))

module.exports = router;
