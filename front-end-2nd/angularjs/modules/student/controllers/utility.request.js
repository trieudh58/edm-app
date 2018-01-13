/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */

angularBolt.controller('StudentUtilityRequestController', ['$location', '$localStorage', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', function ($location, $localStorage, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.formData = {};
    getCourseRequests('get-own-created');
    if ($window.boltLoading) $window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {

        // Bolt script
        boltScript();

        // Select
        $('select').select2({minimumResultsForSearch: 1 / 0, width: 'auto'});

    });

    // Select items
    $scope.selectItems = [
        {id: 'get-own-created', name: 'Tất cả các yêu cầu đã tạo'},
        {id: 'get-own-public', name: 'Các yêu cầu đã được chấp nhận'},
        {id: 'get-own-pending', name: 'Các yêu cầu đang chờ duyệt'},
        {id: 'get-own-denied', name: 'Các yêu cầu đã bị từ chối'},
        {id: 'get-all-public', name: 'Tất cả các yêu cầu từ sinh viên'},
    ];

    // Call function
    $('#selectedItem').change(function () {
        var val = $(this).val();
        getCourseRequests(val);
    });

    // Call api
    function getCourseRequests(uri) {

        $scope.email = $localStorage.email;

        if (uri == 'get-own-created' || uri == 'get-own-public' || uri == 'get-own-pending' || uri == 'get-own-denied') {
            $scope.own = 1;

        } else {
            $scope.own = 0;
        }

        rest.path = 'course-requests/' + uri;
        rest.get().then(function boltSuccess(response) {

            if (response.data.success == true) {

                $scope.dataRequests = response.data.data;

            } else {

                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    }

    // Call function
    $scope.joinCourse = function (id) {

        // Call api
        rest.path = 'course-requests/join';
        rest.putModel({'courseRequestId': id}).then(function boltSuccess(response) {

            if (response.data.success == true) {

                toastr.success('Gia nhập khóa học thành công', 'Thông báo!');
                //getCourseRequests('get-own-created');

            } else {

                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });

    }

    // Call function
    $scope.unJoinCourse = function (id) {

        // Call api
        rest.path = 'course-requests/undo-join';
        rest.putModel({'courseRequestId': id}).then(function boltSuccess(response) {

            if (response.data.success == true) {

                toastr.success('Hủy bỏ gia nhập khóa học thành công', 'Thông báo!');
                //getCourseRequests('get-own-created');

            } else {

                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });

    }

    // Call api
    rest.path = 'subjects/get-names-and-credits';
    rest.get().then(function boltSuccess(response) {

        if (response.data.success == true) {

            $scope.dataSubjects = convertSubjectIdArray(response.data.subjects);
            $scope.dataExpectedTime = expectedTimeArray();

        } else {

            // Response error
            apiError(response);
        }

    }, function boltError(response) {

        // Response error
        apiError(response);

    });

    // Validate rule
    $scope.validationRules = {
        subjectId: {
            type: 'text',
            required: true,
        },
        expectedTime: {
            type: 'text',
            required: true,
        },
        reason: {
            type: 'text',
            required: true,
        },
    };

    // Call function
    $scope.postData = function (formData) {

        rest.path = 'course-requests/create';
        rest.postModel(formData).then(function boltSuccess(response) {

            if (response.data.success == true) {

                //toastr.success(response.data.message, 'Thông báo!');
                toastr.success('Thông tin đã được gửi đi thành công', 'Thông báo!');
                $scope.formData = {};
                $scope.formController.resetErrors();
                getCourseRequests('get-own-created');

            } else {

                //toastr.warning(response.data.message, 'Thông báo!');
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });

    }

    // Call function
    $scope.cancelRequest = function (id) {

        rest.path = 'course-requests/delete-one';
        rest.deleteModel({'courseRequestId': id}).then(function boltSuccess(response) {

            if (response.data.success == true) {

                //toastr.success(response.data.message, 'Thông báo!');
                toastr.success('Hủy yêu cầu khóa học thành công', 'Thông báo!');
                //getCourseRequests('get-own-created');

            } else {

                //toastr.warning(response.data.message, 'Thông báo!');
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });

    }


}]);