var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
   username: String,
   createdDate: String,
   highScore: Number,
   lastSignInDate: String,
   totalRoundsPlayed: Number
});

module.exports = mongoose.model('user', userSchema);