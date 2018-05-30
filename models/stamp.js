var mongoose = require('mongoose');

var stampSchema = new mongoose.Schema({
    name: String,
    neighborhood: String,
    image: String,
    description: String,
    commentCount: Number,
    question: String,
    answer: String,
    reqStamp: Boolean,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model("Stamp", stampSchema);