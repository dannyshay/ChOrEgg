var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
   username: String,
   createdDate: String,
   highScore: Number,
   lastSignInDate: String
});

module.exports = mongoose.model('user', userSchema);