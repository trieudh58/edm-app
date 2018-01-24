
 
angularBolt.controller('StudentRecommendationSubjectController', ['$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function ($location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    // Get data
    rest.path = 'recommendations/get-next-semester-subjects';
    rest.get().then(function boltSuccess(response) {

        if (response.data.success == true) {

            // Response success
            $scope.items = response.data.data;


        } else {

            // Response error
            apiError(response);
        }

    }, function boltError(response) {

        // Response error
        apiError(response);

    });

}]);