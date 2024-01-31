const express = require('express');
const router = express.Router();
const articlesDao = require("../modules/articles-dao");
const likesDao = require("../modules/likes-dao.js");
const commentsDao = require("../modules/comments-dao.js");


router.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});

router.get('/', async (req, res) => {
    try {
        const articles = await articlesDao.retrieveAllArticles();
        let user_articles = [];
        let user = null;
        if (req.session && req.session.user) {
            user = req.session.user;

            user_articles = await articlesDao.retrieveAllArticlesById(req.session.user.user_id);
        }
        // console.log(user);
        res.render("home", { articles: articles, user_articles: user_articles ,user: user });

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

router.post('/like-article', async (req, res) => {
    const { articleId, userId } = req.body;

    try {
        // 检查用户是否已经点赞该文章
        const alreadyLiked = await likesDao.checkIfUserLikedArticle(articleId, userId);
       console.log(`alreadyLiked:${alreadyLiked}`);
        if (alreadyLiked) {
            // 如果已经点赞，取消点赞并减少点赞数
            console.log("already liked");
            await likesDao.removeLike(articleId, userId);
        } else {
            // 如果尚未点赞，添加点赞并增加点赞数
            console.log("add like");
            await likesDao.addLike(articleId, userId);
        }

        // 获取更新后的点赞数
        const newLikeCount = await likesDao.getLikeCount(articleId);
        console.log(`routes newlikes count is:${newLikeCount}`)

        res.json({ success: true, newLikeCount: newLikeCount.toString() });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});

router.get('/get-comments/:articleId', async (req, res) => {
    const articleId = req.params.articleId;
    try {
        const comments = await commentsDao.getCommentsByArticleId(articleId);
        console.log(`routes comments:${comments}`);
        res.json(comments);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


module.exports = router;
