const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser(function(user, done){
    return done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.model.findById(id, function(err, user){
        return done(err, user);
    });
});

passport.use('local.login', new LocalStrategy({
  usernameField: "username",
  passwordField: "password",
  passReqToCallback: true
}, function(req, username, password, done){
    req.checkBody('username', 'Username is empty').notEmpty();
    req.checkBody('password', 'Password is empty').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        let messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.model.findOne({"username": username}, function(err, user){
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: "No user found"});
        }
        if(!User.validPassword(password, user.password)){
            return done(null, false, {message: "Wrong password"});
        }
        req.session.username = user.username;
        console.log(req.session.username);
        return done(null, user);
    });
}));