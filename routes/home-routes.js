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

router.post('/delete-article/:articleId', async (req, res) => {
    try {
        await articlesDao.deleteArticle(req.params.articleId);
        res.status(200).send("Article deleted successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting article.");
    }
});

router.post('/check-if-author', async (req, res) => {
    const { user_id, articleId } = req.body; // 从请求体中获取 userId 和 articleId

    try {
        console.log(`用户ID：${user_id}  文章ID：${articleId}`);
        // 调用 DAO 方法检查给定用户是否为指定文章的作者
        const isAuthor = await articlesDao.checkIfAuthor(user_id, articleId);
        console.log(`是否作者：${isAuthor}`);
        if (isAuthor) {
            // 如果是作者，返回相应的 JSON 响应
            res.json({ isAuthor: true, message: "User is the author of the article." });
        } else {
            // 如果不是作者，也返回一个 JSON 响应，但标识为非作者
            res.json({ isAuthor: false, message: "User is not the author of the article." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while checking authorship.");
    }
});
//-----------------------------likes--------------------------------------
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

//-----------------------------comments--------------------------------------
router.get('/get-comments/:articleId', async (req, res) => {
    const articleId = req.params.articleId;
    try {
        const comments = await commentsDao.getCommentsByArticleId(articleId);
        // console.log(`routes comments:${comments}`);
        res.json(comments);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/get-comment-comments/:commentId', async (req, res) => {
    const parentCommentId = req.params.commentId;
    try {
        const comments = await commentsDao.getCommentsByParentCommentId(parentCommentId);
        // console.log(`返回结果成功`);
        res.json(comments);
    } catch (error) {
        console.log(`返回json失败`);
        res.status(500).send(error.message);
    }
});
router.post('/delete-comment/:commentId', async (req, res) => {
    try {
        await commentsDao.deleteComment(req.params.commentId);
        res.status(200).send("Comment deleted successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting comment.");
    }
});

router.post('/check-if-commenter', async (req, res) => {
    const { user_id, commentId } = req.body; // 从请求体中获取 userId 和 articleId

    try {
        console.log(`用户ID：${user_id}  评论ID：${commentId}`);
        // 调用 DAO 方法检查给定用户是否为指定评论的作者
        const isCommenter = await commentsDao.checkIfCommenter(user_id,commentId );
        console.log(`是否评论者：${isCommenter}`);
        if (isCommenter) {
            // 如果是作者，返回相应的 JSON 响应
            res.json({ isAuthor: true, message: "User is the commenter of the comment." });
        } else {
            // 如果不是作者，也返回一个 JSON 响应，但标识为非作者
            res.json({ isAuthor: false, message: "User is not the commenter of the comment." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while checking commentership.");
    }
});
module.exports = router;
