var mongoose = require('mongoose');

var difficultySchema = new mongoose.Schema({
   name: String,
   timeSpan: Number
});

module.exports = mongoose.model('difficulty', difficultySchema);