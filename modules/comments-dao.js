const database = require("./database.js");

async function getCommentsByArticleId(articleId) {
    const db = await database;
    const result = await db.query('SELECT c.commentId,c.date,c.articleId,c.content,c.commenter_id,cc.comment_comment_id,u.userName,u.avatar FROM comments AS c JOIN users AS u ON c.commenter_id = u.user_id LEFT JOIN comment_comment AS cc ON c.commentId = cc.commentId WHERE c.articleId = ?', [articleId])
    return result;
}

async function getCommentsByParentCommentId(parentCommentId) {
    const db = await database;
    const result = await db.query('select c.commentId,c.date,c.articleId,c.content,c.commenter_id,cc.comment_comment_id,u.userName,u.avatar from comments as c join users as u on c.commenter_id = u.user_id left join comment_comment as cc on c.commentId = cc.commentId where cc.comment_comment_id = ? ', [parentCommentId]);
    return result;
}

async function isParentComment(commentId) {
    const db = await database;
    const result = await db.query('select * from comment_comment where commentId=?', [commentId]);
    return result.length === 0;
}

async function isChildComment(commentId) {
    const db = await database;
    const result = await db.query('select * from comment_comment where commentId=?', [commentId]);
    return result.length > 0;
}

async function checkIfCommentUser(commentId, user_id) {
    const db = await database;
    const result = await db.query('select c.commentId,c.date,c.articleId,c.content,c.commenter_id,cc.comment_comment_id from comments as c  left join comment_comment as cc on c.commentId = cc.commentId where c.commentId = ? and c.commenter_id=?', [commentId, user_id]);
    return result.length > 0;
}

async function deleteComment(commentId) {
    const db = await database;
    const comments = await checkIfParentComment(commentId);
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

async function checkIfParentComment(commentId) {
    const db = await database;
    const comments = await db.query('select commentId from comment_comment where comment_comment_id=?', [commentId]);
    if (comments.length > 0) {
        return comments;
    } else {
        return null;
    }
}

async function checkIfCommenter(user_id, commentId) {
    const db = await database;
    const result = await db.query('select * from comments where commentId=? and commenter_id=?', [commentId, user_id]);
    return result.length > 0;
}

async function createChildComment(user_id, comment_comment_id, content) {
    const db = await database;
    // 先用comment_comment_id 获得 articleId
    //First, use comment_comment_id to get articleId.
    const articleId = await db.query('select articleId from comments where commentId=?', [comment_comment_id]);
    const newComment = await db.query('insert into comments(content, articleId, commenter_id) VALUES(?,?,?)', [content, articleId[0].articleId, user_id]);
    const comment_comment = await db.query('insert into comment_comment(commentId, comment_comment_id)VALUES(?,?)', [newComment.insertId, comment_comment_id]);
    return newComment.affectedRows > 0;
}

async function createParentComment(user_id, articleId, content) {
    const db = await database;
    const newComment = await db.query('insert into comments (content, articleId, commenter_id) VALUES(?,?,?)', [content, articleId, user_id]);
    return newComment.affectedRows > 0;
}

async function getCommentByCommentId(commentId) {
    const db = await database;
    const result = await db.query('select * from comments where commentId=?', [commentId]);
    return result[0];
}

async function getCommentsNum(articleId) {
    const db = await database;
    const rows = await db.query('select count(*) as commentsNum from comments where articleId = ?', [articleId]);
    if (rows.length > 0) {
        // 返回评论数量Return the number of comments.
        return rows[0].commentsNum;
    } else {
        // 如果没有找到评论，返回0 If no comments are found, return 0.
        return 0;
    }
}

async function deleteCommentAndReplies(commentId) {
    // 第一步：找出所有子评论ID Step one: Find all the IDs of the sub-comments.
    const db = await database;
    const childComments = await db.query(`select commentId
                                          from comment_comment
                                          where comment_comment_id = ? `, [commentId]);

    // 第二步：如果有子评论的话，递归删除这些子评论
    //Step two: If there are sub-comments, recursively delete these sub-comments.
    if (childComments.length > 0) {
        for (const childComment of childComments) {
            await deleteCommentAndReplies(childComment.commentId);
        }
    }

    // 第三步：删除原评论 Step three: Delete the original comment.
    await db.query(` delete
                     from comment_comment
                     where commentId = ?`, [commentId]);
    await db.query(` delete
                     from comments
                     where commentId = ?`, [commentId]);

}


module.exports = {
    getCommentsByArticleId,
    getCommentsByParentCommentId,
    isParentComment,
    isChildComment,
    checkIfCommentUser,
    checkIfCommenter,
    deleteComment,
    createChildComment,
    createParentComment,
    getCommentByCommentId,
    getCommentsNum,
    deleteCommentAndReplies
};