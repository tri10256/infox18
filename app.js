const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    configDB = require('./config/db'),
    Users = require('./models/user');

mongoose.connect(configDB.url, {useNewUrlParser: true})
    .then(function () {
        console.log("mongo connected!");
    })
    .catch(function (err) {
        console.log('err:' + err);
    });
require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    secret: 'infox123',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

function isLoggedIn(req, res, next){
    if(req.isAuthenticated() === true){
        return next();
    }
    res.redirect('/signIn');
}

app.get('/', function (req, res) {
    res.render("pages/home");
});

app.get('/signIn', function (req,res) {
    res.render("pages/signIn", {message: req.flash("signUpLogInMessage")});
});

app.post('/signUp', passport.authenticate('local-signUp', {
    successRedirect: '/',
    failureRedirect: '/signIn',
    failureFlash: true
}));

app.post('/signIn', passport.authenticate('local-signIn', {
    successRedirect: '/profile',
    failureRedirect: '/signIn',
    failureFlash: true
}));

app.get('/profile', isLoggedIn, function (req, res) {
    console.log(req.user);
    res.render('pages/profile', {user: req.user});
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

app.get('/events', function (req, res) {
    res.render("pages/events");
});

app.get('/about', function (req, res) {
    res.render("pages/about");
});

app.get('/contact', function (req, res) {
    res.render("pages/contact");
});

app.get('/schedule', function (req, res) {
    res.render("pages/schedule");
});

app.get('/sponsers', function (req, res) {
    res.render("pages/sponsers");
});

app.listen(process.env.PORT || 8080, function(){
    console.log("server started!");
});