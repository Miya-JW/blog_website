const database = require("./database.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;


async function createUser(user) {
    const db = await database;
    const userName=user.userName;
    console.log(user);
    const plainTextPassword = user.password;
    const hash = await bcrypt.hash(plainTextPassword, saltRounds);
    const result = await db.query('insert into users (userName, password) values (?, ?)', [userName, hash]);

    return user;
}

async function retrieveUserIdByUsername(username) {
    const db=await database;
    console.log(username);
    const result = await db.query('select user_id from users where userName=?',[username]);
console.log(result);
    return result[0].user_id;
}

async function retrieveUserWithCredentials(username, password) {
    const db = await database;
    const user_id = await retrieveUserIdByUsername(username);

    const rows = await db.query('select password from users where user_id = ?', [user_id]);
    // console.log(rows);
    const hash = rows[0].password;
    let user;
    const match = await bcrypt.compare(password, hash);
    if (match) {
        const users = await db.query('select * from users where user_id = ?', [user_id]);
        user = users[0];
    }
    return user;
}

async function retrieveAllUsers() {
}

async function updateUser(user) {
}

async function deleteUser(id) {
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
    console.log(field);
    if (field=='userName'){
        await db.query()
        await db.query(`update articles set author_name = ? where author_id = ?`,[value,user_id]);
    }

    await db.query(`update users set ${field} = ? where user_id = ?`,[value,user_id]);
    const newUser = await db.query("select * from users where user_id=?",[user_id]);
    return newUser[0];
}


// Export functions.
module.exports = {
    createUser,
    retrieveUserById: retrieveUserIdByUsername,
    retrieveUserWithCredentials,
    retrieveAllUsers,
    updateUser,
    deleteUser,
    checkUserExists,
    updateUserProfile
};