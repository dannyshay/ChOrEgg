angular
    .module('choregg')
    .factory('SocketService', ['socketFactory', 'choreggAPI', function(socketFactory, choreggAPI) {
    	//TODO - Find a way to call getVariable for this - doesn't like that I use a promise in the get() function
    	return socketFactory({
			prefix: '',
			ioSocket: io.connect('http://localhost:6969')
		});
    }]);