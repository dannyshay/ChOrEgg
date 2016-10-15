angular
    .module('choregg')
    .factory('SocketService', ['socketFactory', function(socketFactory) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect('http://localhost:8080')
        })
    }]);