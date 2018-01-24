
 
angularBolt.controller('StudentNotificationDetailController', ['$routeParams','$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function ($routeParams,$location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.object = {};
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {

        // Bolt script
        boltScript();

        // Close notification
        $('.navbar-right>.open>a').trigger('click');

    });

    // Call api
    rest.path = 'notifications/mark-one-as-read';
    rest.putModel({'notificationId':  $routeParams.id}).then(function boltSuccess(response) {

        if (response.data.success == true) {
            $rootScope.reloadNotification();

        }else {

            // Response error
            apiError(response);
        }

    }, function boltError(response) {

        // Response error
        apiError(response);

    });

    // Call api
    rest.path = 'notifications/get-by-id?notificationId='+ $routeParams.id;
    rest.get().then(function boltSuccess(response) {

        if (response.data.success == true) {
            $scope.object = response.data.data;

        }else {

            // Response error
            apiError(response);
        }

    }, function boltError(response) {

        // Response error
        apiError(response);

    });

}]);