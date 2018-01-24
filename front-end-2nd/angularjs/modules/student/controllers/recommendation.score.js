
angularBolt.controller('StudentRecommendationScoreController', ['NgTableParams', '$location', '$localStorage', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', function (NgTableParams, $location, $localStorage, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    if ($window.boltLoading) $window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {

        // Bolt script
        boltScript();

        // Select
        $('select').select2({minimumResultsForSearch: 1 / 0, width: 'auto'});

    });

    rest.path = 'subjects/get-names-and-credits';
    rest.get().then(function boltSuccess(response) {
        if (response.data.success == true) {

            $scope.tableParams = new NgTableParams({}, {
                dataset: convertRecommendationScoreArray(response.data.subjects)
            });

        }
        else {
            console.log('error');
        }
    }, function boltError(response) {
        apiError(response);
    })


    $scope.getPredictScore = function (subjectCode) {
        rest.path = 'score-predictions/predict-one-subject';
        rest.getWithParams({'subjectCode': subjectCode}).then(function boltSuccess(response) {

            if (response.data.success == true) {
                $scope.scorePrediction = response.data.data.prediction.score;

            }
            else {
                console.log('error');
            }
        }, function boltError(response) {
            apiError(response);
        })
    };


    $scope.passInfo = function (data) {
        $scope.selectedSubjectInfo = data;
    }

}]);