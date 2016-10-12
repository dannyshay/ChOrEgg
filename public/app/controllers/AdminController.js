angular
    .module('choregg')
    .controller('AdminController', ["$scope", 'Upload', 'choreggAPI', function($scope, Upload, choreggAPI) {
        var currentFile = null;

        $scope.$on('loadingChanged', function(event, options) {
            $scope.loading = options.loading;
        });

        $scope.$on('currentStateChanged', function(event, options) {
            $scope.currentState =  options.currentState;
        });

        $scope.hasFiles = function() {
            return currentFile != null;
        }

        $scope.submit = function() {
            if ($scope.form.file.$valid && $scope.file) {
                $scope.upload($scope.file);
            }
        };

        // upload on file select or drop
        $scope.upload = function (file) {
            if (file == null) {
                $scope.invalidFile = true;
                $scope.invalidMessage = "File could not be selected."
                return;
            }

            if(file.name != null && file.name.endsWith('.csv')) {
                $scope.file = file;
                $scope.invalidFile = false;

                Upload.upload({
                    url: '/api/admin/postFile',
                    method: 'POST',
                    data: {test:"test"}, // Any data needed to be submitted along with the files
                    file: file
                }).then(function(result) {
                    $scope.jsonData = result.data.csv;
                });
            } else if(file.name != null) {
                $scope.file = null;
                $scope.invalidFile = true;
                $scope.invalidMessage = "Please select a CSV file."
            }
        };

        $scope.clearItems = function() {
            if (confirm('Are you sure you want to delete these items?')) {
                choreggAPI.DeleteAllItems().then(function(response) {
                    $scope.itemsCleared = true;
                })
            } else {
                return false;
            }
        };

        $scope.addItems = function() {
            choreggAPI.AddItems($scope.jsonData).then(function(response) {
                $scope.itemsAdded = true;
            });
        };

        $scope.downloadAndFormatImages = function() {
            choreggAPI.DownloadAndFormatImages().then(function() {
                alert('Images downloaded and formatted successfully.');
            });
        };

        $scope.resetBulkItemLoadTool = function() {
            $scope.file = null;
            $scope.invalidFile = null;
            $scope.itemsCleared = null;
            $scope.itemsAdded = null;
        };
    }]);