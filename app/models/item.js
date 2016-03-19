var mongoose = require('mongoose');

// define our item model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('item', {
   name: {type: String, default: ''},
   date: {type: Date, default: '1/1/0001'},
   image: {type: String, default: ''}
});