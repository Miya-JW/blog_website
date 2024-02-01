const database = require("./database.js");

async function getCommentsByArticleId(articleId) {
    const db = await database;
    const result = await db.query('SELECT c.commentId,c.date,c.articleId,c.content,c.commenter_id,cc.comment_comment_id,u.userName,u.avatar FROM comments AS c JOIN users AS u ON c.commenter_id = u.user_id LEFT JOIN comment_comment AS cc ON c.commentId = cc.commentId WHERE c.articleId = ?',[articleId]
)

    // console.log(`评论中的评论的长度是：${result.length}`);
    // console.log(`评论中的评论的第一个的ID是：${result[0].commentId}`);
    // console.log(`评论：${result}`);
    return result;
}
// const result = await db.query('select c.commentId,c.date,c.articleId,c.content,c.commenter_id,cc.comment_comment_id,u.userName,u.avatar from comments as c join users as u on c.commenter_id = u.user_id left join comment_comment as cc on c.commentId = cc.commentId where c.articleId = ? ', [articleId]);
// const result = await db.query('select comments.commentId,comments.date,comments.articleId,comments.content,comments.commenter_id,comments.comment_comment_id,users.userName,users.avatar from comments join users on comments.commenter_id = users.user_id where comments.articleId=?',[articleId]);
async function getCommentsByParentCommentId(parentCommentId) {
    const db = await database;
    const result = await db.query('select c.commentId,c.date,c.articleId,c.content,c.commenter_id,cc.comment_comment_id,u.userName,u.avatar from comments as c join users as u on c.commenter_id = u.user_id left join comment_comment as cc on c.commentId = cc.commentId where c.commentId = ? ', [parentCommentId]);

    // ('select comments.commentId,comments.date,comments.articleId,comments.content,comments.commenter_id,comments.comment_comment_id,users.userName,users.avatar from comments join users on comments.commenter_id = users.user_id where comments.commentId=?',[commentId]);
    console.log(result.length);

    return result;
}

async function isParentComment(commentId) {
    const db = await database;
    const result = await db.query('select c.commentId,c.date,c.articleId,c.content,c.commenter_id,cc.comment_comment_id from comments as c  left join comment_comment as cc on c.commentId = cc.commentId where cc.comment_comment_id = ? ', [commentId]);
    // const result = await db.query('select * from comments where comment_comment_id=?',[commentId] );
    return result.length > 0;
}

async function checkIfCommentUser(commentId, user_id) {
    const db = await database;
    const result = await db.query('select c.commentId,c.date,c.articleId,c.content,c.commenter_id,cc.comment_comment_id from comments as c  left join comment_comment as cc on c.commentId = cc.commentId where c.commentId = ? and c.commenter_id=?', [commentId, user_id]);
    // const result = await db.query('select * from comments where commentId=? and commenter_id=?',[commentId,user_id]);
    return result.length > 0;
}

async function deleteComment(commentId) {
    const db = await database;
    // await db.query('delete from comment_comment where commentId in (select commentId from comments where articleId = ?) OR comment_comment_id in (select commentId from comments where articleId = ?)',[articleId,articleId]);
    // await db.query('delete from comments where articleId = ?',[articleId]);
    // await db.query('delete from comment_comment where comment_comment_id=?',[commentId]);
    // await db.query('delete from comments where commentId=?',[commentId]);
    const comments = await db.query('select commentId from comment_comment where comment_comment_id=?', [commentId]);
    if (comments) {
        for (const comment of comments) {
            const commentId = comment.commentId;
            await db.query('delete from comments where commentId = ?', [commentId]);
        }
        await db.query('delete from comment_comment where comment_comment_id = ?', [commentId]);
    }

    await db.query('delete from comment_comment where commentId = ?', [commentId]);
    const result = await db.query('delete from comments where commentId=?', [commentId]);
    return result.affectedRows > 0;
}

async function checkIfCommenter(user_id,commentId){
    const db = await database;
    const result = await db.query('select * from comments where commentId=? and commenter_id=?',[commentId,user_id]);
    console.log(`dao返回删除评论结果：${result}`);
    return result.length>0;
}

module.exports = {
    getCommentsByArticleId,
    getCommentsByParentCommentId,
    isParentComment,
    checkIfCommentUser,
    checkIfCommenter,
    deleteComment
};