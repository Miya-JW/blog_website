const database = require("./database.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;


async function createUser(user) {
    const db = await database;
    const userName=user.userName;
    console.log(user);
    const plainTextPassword = user.password;
    const hash = await bcrypt.hash(plainTextPassword, saltRounds);
    const result = await db.query('INSERT INTO users (userName, password) VALUES (?, ?)', [userName, hash]);
    return user;
}

async function retrieveUserById(id) {
}

async function retrieveUserWithCredentials(username, password) {
    const db = await database;
    const rows = await db.query('SELECT password FROM users WHERE userName = ?', [username]);
    const hash = rows[0].password;
    let user;
    const match = await bcrypt.compare(password, hash);
    if (match) {
        const users = await db.query('select * from users where username = ?', [username]);
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

// Export functions.
module.exports = {
    createUser,
    retrieveUserById,
    retrieveUserWithCredentials,
    retrieveAllUsers,
    updateUser,
    deleteUser,
    checkUserExists
};