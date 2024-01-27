// Load a .env file if one exists
require('dotenv').config()

const express = require("express");
const handlebars = require("express-handlebars");
const app = express();

// Listen port will be loaded from .env file, or use 3000 if
const port = process.env.EXPRESS_PORT || 3000;

// Setup Handlebars
app.engine("handlebars", handlebars.create({
    defaultLayout: "main"
}).engine);
app.set("view engine", "handlebars");

// Set up to read POSTed form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json({}));


// TODO: Your app here
// Setup body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Setup express-session
const session = require("express-session");
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "CS719"
}));

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Setup our routes
const loginRouter = require("./routes/login-routes");
app.use(loginRouter);

const articlesRouter = require("./routes/article-routes.js");
app.use(articlesRouter);



app.get('/login', (req, res) => {
    res.render('login');
});



app.listen(port, function () {
    console.log(`Web final project listening on http://localhost:${port}/`);
});
