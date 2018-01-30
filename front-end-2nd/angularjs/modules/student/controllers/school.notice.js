
 
angularBolt.controller('StudentSchoolNoticeController', ['NgTableParams','$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function (NgTableParams,$location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    // Call api
    rest.path = 'important-notification/get-all-headers';
    rest.get().then(function boltSuccess(response) {

        if (response.data.success == true) {

            $scope.responseData = response.data.data;

        }else {

            // Response error
            apiError(response);
        }

    }, function boltError(response) {

        // Response error
        apiError(response);

    });

    //
    $scope.getPost = function (id) {

        // Call api
        rest.path = 'important-notification/get-one-by-id?notificationId='+id;
        rest.get().then(function boltSuccess(response) {

            if (response.data.success == true) {

                $scope.responsePostData = response.data.data;
                $scope.responsePostData.body =$scope.responsePostData.body.replace(/\n/g, '<br/>');
            }else {

                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });

    }

}]);