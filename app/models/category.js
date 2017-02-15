var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
   name: String,
   difficulty: String,
   timeSpan: Number
});

module.exports = mongoose.model('category', categorySchema);