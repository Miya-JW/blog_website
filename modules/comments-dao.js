const database=require("./database.js");




async function getCommentsByArticleId(articleId,user_id){
    const db= await database;
    const result = await db.query('select comments.commentId,comments.date,comments.articleId,comments.content,comments.commenter_id,comments.comment_comment_id,users.userName,users.avatar from comments join users on comments.commenter_id = users.user_id where comments.articleId=?',[articleId]);
    console.log(result.length);

    return result;
}

module.exports={
    getCommentsByArticleId
};