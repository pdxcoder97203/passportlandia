var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
 
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    level: String,
    completedHoods: String,
    nstamps: [String],
    neStamps: [String],
    nwStamps: [String],
    seStamps: [String],
    swStamps: [String]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);