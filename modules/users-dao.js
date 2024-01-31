const database = require("./database.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;


async function createUser(user) {
    const db = await database;
    const userName=user.userName;
    const plainTextPassword = user.password;
    const hash = await bcrypt.hash(plainTextPassword, saltRounds);
    await db.query('insert into users (userName, password) values (?, ?)', [userName, hash]);
    const result = db.query('select * from users where userName=?',[userName]);
    return result;
}

async function retrieveUserIdByUsername(username) {
    const db=await database;
    const result = await db.query('select user_id from users where userName=?',[username]);
    return result[0].user_id;
}

async function retrieveUserWithCredentials(username, password) {
    const db = await database;
    const user_id = await retrieveUserIdByUsername(username);

    const rows = await db.query('select password from users where user_id = ?', [user_id]);
    const hash = rows[0].password;
    let user;
    const match = await bcrypt.compare(password, hash);
    if (match) {
        const users = await db.query('select * from users where user_id = ?', [user_id]);
        user = users[0];
    }
    return user;
}

async function verifyUserPassword(user_id,password){
    const db = await database;
    const rows = await db.query('select password from users where user_id = ?', [user_id]);
    const hash = rows[0].password;
    let user;
    const match = await bcrypt.compare(password, hash);
    return match;

}



async function deleteUser(user_id) {
    console.log(`user_id:${user_id}`);
    const db=await database;
    const articles = await db.query('select * from articles where author_id=?',[user_id]);
    console.log(`articles:${articles}`);
    for (const article of articles) {
     const articleId=article.articleId;
     console.log(`articleID:${articleId}`);
     await db.query('DELETE FROM comments WHERE commenter_id = ?',[user_id]);
     await db.query('DELETE FROM comments WHERE articleId = ?',[articleId]);
     await db.query('DELETE FROM likes WHERE articleId = ?',[articleId]);
     await db.query('DELETE FROM likes WHERE user_id = ?',[user_id]);
     await db.query('DELETE FROM articles WHERE author_id = ?',[user_id]);
     await db.query('DELETE FROM users WHERE user_id = ?',[user_id]);
    return true;
    }





}

async function checkUserExists(username){
    const db=await database;
    const result = await db.query("select * from users where userName=?",[username]);
    return result.length>0;
}

async function updateUserProfile(user_id, field, value) {
    const validFields = ['userName', 'password', 'real_name','date_of_birth','description','avatar'];
    if (!validFields.includes(field)) {
        throw new Error('Invalid field name');
    }
    const db = await database;
    if (field==='password'){
        value=await bcrypt.hash(value, saltRounds);
    }
    await db.query(`update users set ${field} = ? where user_id = ?`,[value,user_id]);
    const newUser = await db.query("select * from users where user_id=?",[user_id]);
    return newUser[0];
}


// Export functions.
module.exports = {
    createUser,
    retrieveUserIdByUsername,
    verifyUserPassword,
    retrieveUserWithCredentials,
    updateUserProfile,
    deleteUser,
    checkUserExists,
    updateUserProfile
};