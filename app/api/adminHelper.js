var multiparty = require('multiparty');

module.exports = {
    //getCategories - Use this to get the distinct categories in the entire database
    postFile: function (req, res) {
        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {

            var Converter = require("csvtojson").Converter;
            var converter = new Converter({headers:['category','name','date','image']});
            converter.fromFile(files.file.path,function(err,result){
                if (err) {
                    console.log('ERROR = ' + err);
                    res.status(500);
                    res.send({Error: err});
                } else {
                    console.log('RESULT = ' + JSON.stringify(result));
                    res.send({csv:result});
                }
            });
        });
    }
};