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
        console.log(articles);
        res.render("home",{ articles });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


module.exports = router;
