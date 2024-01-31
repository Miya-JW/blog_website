const database = require("./database.js");


async function createArticle(authorId,content,title){
    const db = await database;
    const result =  await db.query(
        "insert into articles(title,content,author_name) values (?,?,?)",
        [title, content, authorId]
    );
}

async function retrieveArticle(authorId,articleId){}

async function deleteArticle(authorId,articleId){}

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
    const result = await db.query(`SELECT * FROM articles ORDER BY ${sortBy} DESC`);
    return result
}


module.exports={
    createArticle,
    retrieveArticle,
    retrieveAllArticlesById,
    deleteArticle,
    retrieveAllArticles,
    retrieveAllArticlesSorted
};