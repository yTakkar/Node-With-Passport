const express = require('express');
const validator = require('express-validator');
const port = process.env.PORT || 4040;
const hbs = require('express-handlebars');
const route = require('./routes/route');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');

mongoose.connect('localhost:27017/users');

const app = express();

require('./config/passport');

app.engine('hbs', hbs({extname: "hbs", defaultLayout: "layout", layoutsDir: __dirname+"/views/layouts/"}));
app.set('view engine', 'hbs');

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(validator());
app.use(session({secret: "secret", resave: false, saveUninitialized: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/', route);

app.listen(port, function(){
    console.log(`Listening to port ${port}`);
});