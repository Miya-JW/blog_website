const database = require("./database.js");

async function checkIfUserLikedArticle(articleId, userId){
    const db = await database;
    const result = await db.query('select * from likes where articleId=? and user_id=?',[articleId,userId]);
    console.log(`there is likes:${result}`);
    return result.length>0;
}

async function removeLike(articleId, userId){
    const db = await database;
    const result = await db.query('delete from likes where articleId=? and user_id=?',[articleId,userId]);
    console.log(`remove likes:${result}`);
    return result;
}

async function addLike(articleId, userId){
    const db = await database;
    const result = await db.query('insert into  likes (articleId, user_id) values (?,?)',[articleId,userId]);
    console.log(`add likes:${result}`);
    return result;
}

async function getLikeCount(articleId){
    const db = await database;
    const result = await db.query('select count(*) as likeCount  from likes where articleId=? ',[articleId]);
    console.log(`count likes:${result[0].likeCount}`);
    return result[0].likeCount;
}

module.exports={
    checkIfUserLikedArticle,
    removeLike,
    addLike,
    getLikeCount

};