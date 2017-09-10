const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const schema = mongoose.Schema({
    username: {
        type: String, 
        required: true,
        index: true
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    }
});

module.exports.encrypt = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports.validPassword = function(password, hashed_password){
    return bcrypt.compareSync(password, hashed_password);
}

module.exports.model = mongoose.model('user', schema);