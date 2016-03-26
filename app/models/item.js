var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var itemSchema = new Schema({
   name: String,
   date: Number,
   image: String,
   category: String,
   index: Number
});

var Item = mongoose.model('item', itemSchema);

// define our item model
// module.exports allows us to pass this to other files when it is called
module.exports = Item;