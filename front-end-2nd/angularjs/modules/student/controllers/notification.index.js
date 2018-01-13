/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */

angularBolt.controller('StudentNotificationIndexController', ['$location', '$localStorage', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', function ($location, $localStorage, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.notification = {};
    if ($window.boltLoading) $window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {

        // Bolt script
        boltScript();

        // Close notification
        $('.navbar-right>.open>a').trigger('click');

    });

    // Call function
    $rootScope.getAllNotification();


    // Call function
    $scope.deleteItems = function (ids) {

        var ids = ids.join();

        // Call api
        rest.path = 'notifications/delete';
        rest.deleteModel({'notificationIds': ids}).then(function boltSuccess(response) {

            if (response.data.success == true) {

                $rootScope.reloadNotification();
                $rootScope.getAllNotification();
                toastr.warning('Các mục đã chọn đã được xóa thành công', 'Thông báo');

            }else {

                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });

    };



}]);