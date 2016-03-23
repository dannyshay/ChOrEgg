// config/db.js
var url = "";
var mode = process.env.mode || "DEV";

switch (mode) {
    case "PROD":
        url = 'mongodb://app_ChOrEggWeb:!lzUTu%D9NpN@ds015849.mlab.com:15849/choregg';
        break;
    default:
        url = 'mongodb://localhost/choregg';
        break;
}

module.exports = {
    url : url
}