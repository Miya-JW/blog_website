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

        res.render("home", { articles: articles, user_articles: user_articles ,user: user });

    } catch (error) {
        res.status(500).send(error.message);
    }

});


router.post('/create-new-article', async (req, res) => {
    const { content,user_id,title } = req.body;
    const newArticle=await articlesDao.createArticle(content,user_id,title);

    // 假设保存成功
    res.json({ message: 'Article saved successfully',newArticle:newArticle });
});

router.get('/get-article-by-articleId', async (req, res) => {
    try {
        const articleId = req.query.articleId;
        const article = await articlesDao.retrieveArticleByArticleId(articleId);
        if (article) {
            res.json(article);
        } else {
            res.status(404).send('Article not found');
        }
    } catch (error) {
        console.error('Error getting article:', error);
        res.status(500).send(error.message);
    }
});

router.post('/update-article', async (req, res) => {
    const { articleId, title, content } = req.body;

    if (!articleId || !title || !content ) {
        return res.status(400).send('All fields are required');
    }

    try {
        const success = await articlesDao.updateArticle(articleId, title, content);
        if (success) {
            const newArticle = await articlesDao.retrieveArticleByArticleId(articleId);
            res.json({ message: 'Article updated successfully',
                articleId:newArticle.articleId,
                title:newArticle.title,
                content:newArticle.content

            });
        } else {
            res.status(404).send('Article not found');
        }
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).send('Internal Server Error');
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
    const { user_id, articleId } = req.body;

    try {

        // 调用 DAO 方法检查给定用户是否为指定文章的作者
        //Check if the given user is the author of the specified article.
        const isAuthor = await articlesDao.checkIfAuthor(user_id, articleId);

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
        //Check if the user has already liked the article.
        const alreadyLiked = await likesDao.checkIfUserLikedArticle(articleId, userId);

        if (alreadyLiked) {
            // 如果已经点赞，取消点赞并减少点赞数

            await likesDao.removeLike(articleId, userId);
        } else {
            // 如果尚未点赞，添加点赞并增加点赞数

            await likesDao.addLike(articleId, userId);
        }

        // 获取更新后的点赞数
        //Obtain the updated number of likes.
        const newLikeCount = await likesDao.getLikeCount(articleId);

        await articlesDao.updateArticleLikeNum(articleId,newLikeCount);


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

        res.json(comments);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/get-comment-comments/:commentId', async (req, res) => {
    const parentCommentId = req.params.commentId;
    try {
        const comments = await commentsDao.getCommentsByParentCommentId(parentCommentId);

        res.json(comments);
    } catch (error) {

        res.status(500).send(error.message);
    }
});
router.post('/delete-comment/:commentId', async (req, res) => {
    try {

        const commentId = req.params.commentId;
        await commentsDao.deleteCommentAndReplies(commentId);
        res.json({ success: true,message: "Comment deleted successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting comment.");
    }
});

router.post('/add-parent-comment/', async (req, res) => {
    const { user_id, articleId ,content} = req.body;
    try {
        await commentsDao.createParentComment(user_id,articleId,content);
        res.status(200).send("Comment added successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding comment.");
    }
});
router.post('/add-child-comment/', async (req, res) => {
    const { user_id, comment_comment_id ,content} = req.body;
    try {
        await commentsDao.createChildComment(user_id,comment_comment_id,content);
        res.status(200).send("Comment added successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding comment.");
    }
});

router.post('/check-if-commenter', async (req, res) => {
    const { user_id, commentId } = req.body;

    try {

        // 调用 DAO 方法检查给定用户是否为指定评论的作者
        const isCommenter = await commentsDao.checkIfCommenter(user_id,commentId );
        const comment = await commentsDao.getCommentByCommentId(commentId);
        const articleId = comment.articleId;

        const isAuthor = await articlesDao.checkIfAuthor(user_id,articleId);

        if (isCommenter||isAuthor) {
            // 如果是作者，返回相应的 JSON 响应
            res.json({ isAuthor: true, message: "User can delete this comment." });
        } else {
            // 如果不是作者，也返回一个 JSON 响应，但标识为非作者
            res.json({ isAuthor: false, message: "User cannot delete this comment" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while checking commentership.");
    }
});
module.exports = router;
