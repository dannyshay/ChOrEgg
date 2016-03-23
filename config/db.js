// config/db.js
var url = process.env['mongoURI'] || "mongodb://localhost/choregg";

module.exports = {
    url : url
}