/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */
 
angularBolt.controller('StudentUtilityCommentController', ['NgTableParams','$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function (NgTableParams,$location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.subjectCode = null;
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
        $('.chat-list').css({'max-height':$(window).height() - 529,'height':$(window).height() - 529});
    });

    // Call api
    rest.path = 'subjects/get-names-and-credits';
    rest.get().then(function boltSuccess(response) {

        if (response.data.success == true) {

            var subjects = response.data.subjects;

            $scope.tableParams = new NgTableParams({}, {
                dataset: convertSubjectCodeArray(subjects)
            });

            $scope.getSubject(subjects[0].code);
            $scope.subjectCode = subjects[0].code;
            $scope.setSubject(subjects[0].name.vi+' ('+subjects[0].name.en+')' ,subjects[0].code);


        }else {

            // Response error
            apiError(response);
        }

    }, function boltError(response) {

        // Response error
        apiError(response);

    });

    //
    $scope.setSubject = function (name,code) {
        $scope.subjectName = name;
        $scope.subjectCode = code;
    }

    $scope.getSubject = function (subjectCode) {

        rest.path = 'comments/get-by-subject-code?subjectCode='+subjectCode;
        rest.get().then(function boltSuccess(response) {

            if (response.data.success == true) {

                $scope.detail = response.data.data;
                $('.chat-list').css({'max-height':$(window).height() - 529,'height':$(window).height() - 529});

            }else {
                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    };

    // Validate rule
    $scope.validationRules = {
        subjectCode: {
            type: 'text',
            required: true,
        },
        commentBody: {
            type: 'text',
            required: true,
        },
    };

    // Call function
    $scope.postComment = function (body,code) {

        var formData = {
            'subjectCode' : code,
            'commentBody' : body,
        };

        rest.path = 'comments/create-one';
        rest.postModel(formData).then(function boltSuccess(response) {

            if (response.data.success == true) {

                //toastr.success(response.data.message, 'Thông báo!');
                toastr.success('Thông tin đã được gửi đi thành công', 'Thông báo!');
                $scope.body = null;
                $scope.getSubject(code);
                $('#commenBox').animate({ scrollTop: $('#commenBox').prop('scrollHeight')}, 1000);

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