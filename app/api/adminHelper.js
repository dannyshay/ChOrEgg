var multiparty = require('multiparty');
var fs  = require('fs');
var csvtojson = require('csvtojson');

module.exports = {
    //getCategories - Use this to get the distinct categories in the entire database
    postFile: function (req, res) {
        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {
            if (err) {
                res.status(400);
                res.send({Error: err.toString()});
            }

            var Converter = csvtojson.Converter;
            var csvConverter=new Converter({constructResult:false}); // The parameter false will turn off final result construction. It can avoid huge memory consumption while parsing. The trade off is final result will not be populated to end_parsed event.

            var readStream = fs.createReadStream(files.file.path);

            var writeStream = fs.createWriteStream("outputData.json");

            readStream.pipe(csvConverter).pipe(writeStream);

            readStream.on('end', function() {
                if (err) {
                    console.log('ERROR = ' + err);
                    res.status(500);
                    res.send({Error: err});
                } else {
                    var result = JSON.parse(fs.readFileSync('outputData.json', 'utf8'));
                    console.log('RESULT = ' + JSON.stringify(result));
                    fs.unlink('outputData.json');
                    res.send({csv:result});
                }
            });


            // var Converter = require("csvtojson").Converter;
            // var converter = new Converter({headers:['category','front','back','date','image'], workerNum: 2, fork:true});
            //
            //
            //
            // converter.fromFile(files.file.path,function(err,result){
            //     if (err) {
            //         console.log('ERROR = ' + err);
            //         res.status(500);
            //         res.send({Error: err});
            //     } else {
            //         console.log('RESULT = ' + JSON.stringify(result));
            //         res.send({csv:result});
            //     }
            // });
        });
    }
};