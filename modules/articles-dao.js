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

async function retrieveAllArticlesById(authorId){}

async function retrieveAllArticles(){
    const db = await database;
    const result = await db.query("select * from articles ");
    console.log(result);
    return result;

}
module.exports={
    createArticle,
    retrieveArticle,
    retrieveAllArticlesById,
    deleteArticle,
    retrieveAllArticles
};