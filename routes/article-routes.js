const express = require('express');
const router = express.Router();
const articlesDao = require("../modules/articles-dao");


router.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});

router.get('/', async (req, res) => {
    try {
        const articles = await articlesDao.retrieveAllArticles();
        let user_articles = [];
        if (req.session && req.session.user) {
            user_articles = await articlesDao.retrieveAllArticlesById(req.session.user.userName);
        }
         console.log(user_articles);
        res.render("home", { articles: articles, user_articles: user_articles });

    } catch (error) {
        res.status(500).send(error.message);
    }

});

router.get('/sort-articles', async (req, res) => {
    try {
        const sortBy = req.query.sortBy;
        const articles = await articlesDao.retrieveAllArticlesSorted(sortBy);
        res.json({articles:articles});
    } catch (error) {
        res.status(500).send(error.message);
    }
});



module.exports = router;
