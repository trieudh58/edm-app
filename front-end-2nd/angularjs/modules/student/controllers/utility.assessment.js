/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */
 
angularBolt.controller('StudentUtilityAssessmentController', ['$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function ($location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.formData = {};
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });


    // Call api
    rest.path = 'subjects/get-names-and-credits';
    rest.get().then(function boltSuccess(response) {

        if (response.data.success == true) {
            $scope.dataSubjects = convertSubjectIdArray(response.data.subjects);
        }else {

            // Response error
            apiError(response);
        }

    }, function boltError(response) {

        // Response error
        apiError(response);

    });

    rest.path = 'lecturer/get-all';
    rest.get().then(function boltSuccess(response) {
        if (response.data.success == true) {
            $scope.dataLecturers= convertLecturerCodeArray(response.data.lecturers);
        }else {

            // Response error
            apiError(response);
        }

    }, function boltError(response) {

        // Response error
        apiError(response);

    });
    rest.path = 'assessment-question/get-question-list-by-purpose?purpose=courseClassAssessment';
    rest.get().then(function boltSuccess(response) {

        if (response.data.success == true) {
            $scope.questions = response.data.questions[0];
            var size= $scope.questions.questionList.length;
            $scope.rating=[];
            while(size--) $scope.rating[size] = 1;
        }else {

            // Response error
            apiError(response);
        }

    }, function boltError(response) {

        // Response error
        apiError(response);

    });
    // Validate rule
    $scope.validationRules = {
        subjectCode: {
            type: 'text',
            required: true,
        },
        lecturerCode: {
            type: 'text',
            required: true,
        }
    };
    //submit answer
    $scope.submitAssessmentAnswer=function(formData) {
        rest.path = 'assessment-question/submit-cource-class-assessment';
        var data=JSON.stringify(assessmentData($scope.rating,$scope.questions.questionList));
        rest.postModel({"answerList":data,
                        "subjectCode":formData.subjectCode,
                        "lecturerCode":formData.lecturerCode}).then(function boltSuccess(response) {

            if (response.data.success == true) {

                toastr.success('Đánh giá đã được gửi đi thành công', 'Thông báo!');
                $scope.formData = {};
                $scope.formController.resetErrors();

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