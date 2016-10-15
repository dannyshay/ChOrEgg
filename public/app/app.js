var deps = ['ngRoute', 'appRoutes','ngCookies','angulartics','ngAnimate','ngResource','timer','google-signin','ngStorage', 'ngAudio','ngFileUpload','btford.socket-io'];

try {
    angular.module("angulartics.google.analytics"); // this throws if GA script is not loaded
    deps.push('angulartics.google.analytics');
} catch(e){ console.error("GA not available", e); }

angular.module('choregg', deps); 