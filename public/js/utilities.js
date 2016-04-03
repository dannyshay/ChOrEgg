function preload() {
    var images = Array();
    for (var i = 0; i < preload.arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i]
    }
}