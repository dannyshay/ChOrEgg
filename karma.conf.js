// Karma configuration
// Generated on Wed Sep 21 2016 20:52:50 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'public/scripts/jQuery/dist/jquery.min.js',
      'public/scripts/bootstrap/dist/js/bootstrap.min.js',
      'public/scripts/angular/angular.min.js',
      'public/scripts/angular-mocks/angular-mocks.js',
      'public/scripts/angular-cookies/angular-cookies.min.js',
      'public/scripts/angular-resource/angular-resource.min.js',
      'public/scripts/angular-route/angular-route.min.js',
      'public/scripts/angular-animate/angular-animate.min.js',
      'public/scripts/angular-preload-image/angular-preload-image.min.js',
      'public/scripts/angular-resource/angular-resource.min.js',
      'public/scripts/angular-timer/dist/angular-timer.min.js',
      'public/scripts/angulartics/dist/angulartics.min.js',
      'public/scripts/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',
      'public/scripts/humanize-duration/humanize-duration.js',
      'public/scripts/loaders.css/loaders.css.js',
      'public/scripts/moment/moment.js',
      'public/scripts/ng-google-signin/dist/ng-google-signin.min.js',
      'public/scripts/ngstorage/ngStorage.min.js',
      'public/scripts/satellizer/dist/satellizer.min.js',
      'public/scripts/SHA-1/sha1.js',

      'public/app/app.js',        // Load your module before the rest of your app.

      'public/app/services/*.js',
      'public/app/controllers/*.js',

      'public/app/appRoutes.js',

        // Karma Tests
      'test/karma/*.js'
    ],

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
