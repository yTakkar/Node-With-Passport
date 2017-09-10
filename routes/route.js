const express = require('express');
const csrf = require('csurf');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

const csrfProtection = csrf();
router.use(csrfProtection);

router.use(function(req, res, next){
    res.locals.username = req.session.username;
    next();
});

router.get('/', (req, res) => {
    res.render('index', {title: "Home page"});
});

router.get('/register', (req, res) => {
    if(req.session.username){
        res.redirect('/profile');
    } else {
        res.render('register', { title: "Register", csrfToken: req.csrfToken() });
    }
});

router.post('/register', (req, res) => {    
    req.checkBody('username', 'Username is empty').notEmpty();
    req.checkBody('username', 'Username must be greater than 4 characters').isLength({min: 4});
    req.checkBody('username', 'Username must be less than 20 characters').isLength({max: 20});
    req.checkBody('username', 'Username must contain letters or numbers only').isAlphanumeric();

    req.checkBody('email', 'Email is empty').notEmpty();
    req.checkBody('email', 'Email is invalid').isEmail();
    
    req.checkBody('password', 'Password is empty').notEmpty();
    req.checkBody('password_again', 'Password is empty').notEmpty();
    req.checkBody('password', 'Passwords don\'t match').equals(req.body.password_again);

    let errors = req.validationErrors();
    if(errors){
        res.render('register', {errors: errors, hasErrors: errors.length > 0, title: "Register", csrfToken: req.csrfToken()});
    } else {
        
        User.model.find({username: req.body.username}, (err, data) => {
            if(err){
                console.log(err);
            }
            if(data.length > 0){
                
                let e = [{msg: "Username already exists!"}];
                res.render('register', {errors: e, hasErrors: e.length > 0, title: "Register", csrfToken: req.csrfToken()});
                console.log('has');

            } else {
                let newUser = User.model({
                    username: req.body.username,
                    email: req.body.email,
                    password: User.encrypt(req.body.password)
                });
                newUser.save((err, data) => {
                    if(err){
                        console.log(err);
                    }
                    // let s = [{msg: "You are registered and now can login"}];
                    // res.render('register', {errors: s, hasErrors: s.length > 0, title: "Register", csrfToken: req.csrfToken()});

                    let s = ["You are now register and can login"];
                    res.render('login', { title: "Login", csrfToken: req.csrfToken(), messages: s, loginErrors: s.length > 0 });
                    console.log('Registered');
                });
            }
        });

    }

});

router.get('/login', (req, res) => {
    let mssg = req.flash('error');
    res.render('login', { title: "Login", csrfToken: req.csrfToken(), messages: mssg, loginErrors: mssg.length > 0 });
});

router.post('/login', passport.authenticate('local.login', {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}));

router.get('/logout', (req, res) => {
    req.session.username = "";
    let s = ['You are now logged out'];
    res.render('login', { title: "Login", csrfToken: req.csrfToken(), messages: s, loginErrors: s.length > 0 });
});

router.get('/profile', (req, res) => {
    res.render('profile', {title: "Profile page"});
});

module.exports = router;