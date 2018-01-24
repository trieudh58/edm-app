

angularBolt.controller('StudentInfomationProfileController', ['$location', '$localStorage', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', function ($location, $localStorage, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.formData = {};
    if ($window.boltLoading) $window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    if ($location.hash() == 'password') {
        $scope.profileIndex = 1;
    } else {
        $scope.profileIndex = 0;
    }

    // Validate rule
    $scope.validationRules = {
        oldPassword: {
            type: 'password',
            required: true,
            minlength: 6
        },
        newPassword: {
            type: 'password',
            required: true,
            minlength: 6
        },
        rePassword: {
            type: 'password',
            required: true,
            custom: function (value, formData) {
                return formData.newPassword === formData.rePassword;
            }
        }
    };

    // Put change password
    $scope.putData = function (formData) {

        rest.path = 'users/change-password';
        rest.putModel(formData).then(function boltSuccess(response) {

            if (response.data.success == true) {

                //toastr.success(response.data.message, 'Thông báo!');
                toastr.success('Mật khẩu đã được thay đổi thành công', 'Thông báo!');
                $location.path('/logout');

            } else {

                //toastr.warning(response.data.message, 'Thông báo!');
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    };

    //
    $scope.getProfile = function () {

        rest.path = 'users/get';
        rest.get().then(function boltSuccess(response) {
            if (response.data.success == true) {
                $scope.studentInfo = response.data.data.personalInfo;
                $rootScope.personalInfo.profilePicture = response.data.data.personalInfo.profilePicture;

                $scope.studentInfo.interests = convertTagsArray(response.data.data.personalInfo.interests);
                $scope.studentInfo.skills = convertTagsArray(response.data.data.personalInfo.skills);

                $scope.email = response.data.data.email;
            }
            else {
                apiError(response);
            }
        }, function boltError(response) {
            apiError(response);
        });
    };

    $scope.getProfile();


    //
    $scope.updateProfile = function (formData) {

        var interestsData = {
            interests : convertTagsObject(formData.interests)
        }
        rest.path = 'users/update-interests';
        rest.putModel(interestsData).then(function boltSuccess(response) {
            if (response.data.success == true) {
                //toastr.success(response.data.message, 'Thông báo!');
                toastr.success('Đã cập nhật sở thích thành công', 'Thông báo!');

            } else {

                //toastr.warning(response.data.message, 'Thông báo!');
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }
        }, function boltError(response) {
            apiError(response);
        });

        var skillsData = {
            skills : convertTagsObject(formData.skills)
        }
        rest.path = 'users/update-skills';
        rest.putModel(skillsData).then(function boltSuccess(response) {
            if (response.data.success == true) {
                //toastr.success(response.data.message, 'Thông báo!');
                toastr.success('Đã cập nhật kỹ năng thành công', 'Thông báo!');

            } else {

                //toastr.warning(response.data.message, 'Thông báo!');
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }
        }, function boltError(response) {
            apiError(response);
        });

    };

    //
    $scope.uploadFile = function (files) {

        var formData = new FormData();
        formData.append('avatar', files[0])

        rest.path = 'users/upload-avatar';
        rest.postFile(formData).then(function boltSuccess(response) {
            if (response.data.success == true) {

                $scope.getProfile();

                //toastr.success(response.data.message, 'Thông báo!');
                toastr.success('Đã cập nhật ảnh đại diện thành công', 'Thông báo!');

            } else {

                //toastr.warning(response.data.message, 'Thông báo!');
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }
        }, function boltError(response) {
            apiError(response);
        });
    };



}]);