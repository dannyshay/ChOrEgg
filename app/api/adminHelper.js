var multiparty = require('multiparty');
var fs = require('fs');
var csvtojson = require('csvtojson');
var jsonfile = require('jsonfile');
var serverUtilities = require('./server_utilities');

var clearOutputDataFileIfExists = function() {
    // Attempts to delete the outputData.json file in case it was left over for some reason
    try {
        fs.accessSync('outputData.json', fs.F_OK);
        fs.unlink('outputData.json');
    } catch (e) {
        // It isn't accessible
    }
};

module.exports = {
    postFile: function (req, res) {
        // Get the current files from the request
        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {
            serverUtilities.handleErrors(res, err);

            // Clear the outputData.json if it is left over for some reason
            clearOutputDataFileIfExists();

            var Converter = csvtojson.Converter;
            var csvConverter = new Converter({constructResult:false,  // The parameter false will turn off final result construction. It can avoid huge memory consumption while parsing. The trade off is final result will not be populated to end_parsed event.
                                                toArrayString:true}); // This parameter will wrap the final JSON string in to an array

            // We have to use streams since our item sets are generally > 1k items
            var readStream = fs.createReadStream(files.file.path);
            var writeStream = fs.createWriteStream("outputData.json");

            // Send the streams through the converter
            readStream.pipe(csvConverter).pipe(writeStream);

            // When we're done writing to the file - clean up and send the results
            writeStream.on('finish', function() {
                jsonfile.readFile('outputData.json', function(err2, obj) {
                    serverUtilities.handleErrors(res, err2);

                    fs.unlink('outputData.json');
                    res.send({csv:obj});
                })
            });
        });
    },
    getVariable: function(req, res) {
        return res.status(200).send({value: process.env[req.params.variable]});
    }
};