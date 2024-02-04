const database = require("./database.js");


async function createArticle(content,user_id,title){
    const db = await database
    const result =  await db.query('insert into articles(title,content,author_id) values (?,?,?)', [title,content,user_id]);
    // return result.affectedRows>0;
    if (result.affectedRows > 0) {
        // 使用insertId获取刚插入的文章信息
        const newArticleId = result.insertId;
        const newArticle = await db.query('SELECT * FROM articles WHERE articleId = ?', [newArticleId]);

        // 假设db.query总是返回一个数组，即使是单个结果
        return newArticle.length ? newArticle[0] : null;
    } else {
        return null; // 插入失败
    }
}



async function retrieveArticleByArticleId(articleId){
    const db= await database;
    const result = await db.query('select * from articles where articleId=?',[articleId]);
    return result[0];
}

async function updateArticle(articleId, title, content){
    console.log(`在dao里开始更改数据库 articleId：${articleId},title：${title},content：${content}`);
    const db= await database;
    const result = await db.query('update articles set title = ?, content = ? where articleId = ?',[title,content,articleId]);
    return result.affectedRows>0;
}

async function deleteArticle(articleId){
    const db = await database;
    await db.query(`delete from comment_comment where commentId in (select commentId from comments where articleId = ?) or comment_comment_id in (select commentId from comments where articleId = ?)`, [articleId, articleId]);
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
    console.log(`dao返回文章删除结果：${result}`);
    return result.length>0;
}

async function updateArticleCommentNum(articleId,newCommentNum){
    const db= await database;
    const result = await db.query('update articles set comments = ? where articleId = ?',[newCommentNum,articleId]);
    return result.affectedRows>0;
}

async function updateArticleLikeNum(articleId,newLikeNum){
    const db= await database;
    const result = await db.query('update articles set likes = ? where articleId = ?',[newLikeNum,articleId]);
    return result.affectedRows>0;
}

module.exports={
    createArticle,
    retrieveAllArticlesById,
    checkIfAuthor,
    deleteArticle,
    retrieveAllArticles,
    retrieveAllArticlesSorted,
    retrieveArticleByArticleId,
    updateArticle,
    updateArticleCommentNum,
    updateArticleLikeNum

};