module.exports = {
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    download: function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            //console.log('content-type:', res.headers['content-type']);
            //console.log('content-length:', res.headers['content-length']);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    },

    cropImageToBounds: function (myImgPath, myMinImgPath, width, height) {
        gm(myImgPath)
            .size(function (err, size) {
                var posX = 0;
                var posY = 0;
                var cropwidth = width;
                var cropheight = height;

                //Landscape image
                if (size.width > size.height) {
                    posX = (size.width - size.height) / 2;
                    posY = 0;
                    cropwidth = size.height;
                    cropheight = size.height;
                } else { // Portrait Image
                    posX = 0;
                    posY = (size.height - size.width) / 2;
                    cropwidth = size.width;
                    cropheight = size.width;
                }

                gm(myImgPath)
                    .crop(posX, posY, cropwidth, cropheight)
                    .write(myMinImgPath, function (err) {
                        if (!err) console.log('Done cropping images to bounds.');
                        if (err) console.log(err);
                    });
            });
    }
};