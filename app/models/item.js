var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
   name: String,
   date: Number,
   image: String,
   category: String,
   imageData: String
});

module.exports = mongoose.model('item', itemSchema);