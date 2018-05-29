var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
 
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    level: String,
    completedHoods: String,
    nStamps: [String],
    neReqStamps: [String],
    nwReqStamps: [String],
    seReqStamps: [String],
    swReqStamps: [String]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);