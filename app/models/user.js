var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
   username: String,
   createdDate: String,
   highScore: Number
});

module.exports = mongoose.model('user', userSchema);