require('dotenv').config({ path: './db.env' });
const mariadb = require("mariadb");

const database = mariadb.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

module.exports = database;
