var Difficulty = require('./../models/difficulty');

module.exports = {
    getAll: function(res) {
        Difficulty.find(function (err, difficulties) {
            if (err)
                res.status(400).send({Error: err});
            else {
                var myDifficulties = [];

                difficulties.forEach(function(aDifficulty) {
                   myDifficulties.push({difficultyName: aDifficulty.name, timeSpan: aDifficulty.timeSpan});
                });

                res.status(200).send(myDifficulties);
            }
        });
    }
};