const database = require("./database.js");


async function createArticle(authorId,content,title){
    const db = await database;
    const result =  await db.query(
        "insert into articles(title,content,author_name) values (?,?,?)",
        [title, content, authorId]
    );
}

async function retrieveArticle(authorId,articleId){}

async function deleteArticle(articleId){
    const db = await database;
    await db.query(`delete from comment_comment where commentId in (select commentId from comments where articleId = ?) or comment_comment_id in (select commentId from comments where articleId = ?)`, [articleId, articleId]);

    // await db.query('DELETE FROM comment_comment WHERE comment_comment_id IN (SELECT commentId FROM comments WHERE articleId = ?)', [articleId]);
    await db.query('delete from comments where articleId=?',[articleId]);
    await db.query('delete from likes where articleId=?',[articleId]);
    await db.query('delete from articles where articleId=?',[articleId]);
}

async function retrieveAllArticlesById(user_id){
    const db = await database;
    const result= await db.query("select * from articles where author_id=? ORDER BY date DESC",[user_id]);
    return result;
}

async function retrieveAllArticles(){
    const db = await database;
    const result = await db.query("select articles.*,users.username as author_name from articles join users on articles.author_id =users.user_id");
    return result;

}


async function retrieveAllArticlesSorted(sortBy) {
    const validSortColumns = ['articleId', 'title', 'date', 'likes', 'author_name'];
    if (!validSortColumns.includes(sortBy)) {
        throw new Error('Invalid sort column');
    }
    const db=await database;
    const result = await db.query(`select articles.articleId, articles.title, articles.date, articles.content, articles.image, articles.likes, articles.comments, articles.author_id, users.userName as author_name
from articles inner join users on articles.author_id = users.user_id order by ${sortBy} desc`);
    // (`SELECT * FROM articles ORDER BY ${sortBy} DESC`);
    return result;
}
async function checkIfAuthor(user_id,articleId){
    const db = await database;
    const result = await db.query('select * from articles where articleId=? and author_id=?',[articleId,user_id]);
    console.log(`dao返回结果：${result}`);
    return result.length>0;
}
// async function checkIfCommentUser(articleId,user_id){
//     const db = await database;
//     const result = await db.query('select * from articles where articleId=? and author_id=?',[articleId,user_id]);
//     return result.length>0;
// }

module.exports={
    createArticle,
    retrieveArticle,
    retrieveAllArticlesById,
    checkIfAuthor,
    deleteArticle,
    retrieveAllArticles,
    // checkIfCommentUser,
    retrieveAllArticlesSorted

};