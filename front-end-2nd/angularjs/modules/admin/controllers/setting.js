
angularBolt.controller('AdminSettingController', ['$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function ($location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.formData = {};
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    // Call function
    $scope.postSmtp = function (formDataSmtp) {

        rest.path = 'admin/system-configurations/update-smtp';
        rest.putModel(formDataSmtp).then(function boltSuccess(response) {

            if (response.data.success == true) {

                //toastr.success(response.data.message, 'Thông báo!');
                toastr.success('Thông tin đã được gửi đi thành công', 'Thông báo!');
                $scope.formData = {};

            }else {

                //toastr.warning(response.data.message, 'Thông báo!');
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });

    }
}]);