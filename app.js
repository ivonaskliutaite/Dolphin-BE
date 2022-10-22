const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// passport copy +
var session = require('express-session');
var passport = require('passport');
var SQLiteStore = require('connect-sqlite3')(session);
// passport copy -

const articlesRouter = require('./routes/articles');
// passport copy +
var authRouter = require('./routes/auth');
// passport copy -

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport copy +
app.use(session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));

app.use(passport.authenticate('session'));
app.use(function(req, res, next) {
    var msgs = req.session.messages || [];
    res.locals.messages = msgs;
    res.locals.hasMessages = !! msgs.length;
    req.session.messages = [];
    next();
});
// passport copy -

app.use('/', articlesRouter);
app.use('/', authRouter);

module.exports = app;
