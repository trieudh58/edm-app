/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */
 
angularBolt.controller('StudentUtilityFeedbackController', ['$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function ($location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.formData = {};
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    // Validate rule
    $scope.validationRules = {
        header: {
            type: 'text',
            required: true,
        },
        body: {
            type: 'text',
            required: true,
            minlength : 20
        },
    };

    // Call function
    $scope.postData = function (formData) {

        rest.path = 'feedbacks/create';
        rest.postModel(formData).then(function boltSuccess(response) {

            if (response.data.success == true) {

                //toastr.success(response.data.message, 'Thông báo!');
                toastr.success('Thông tin đã được gửi đi thành công', 'Thông báo!');
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

    //
    rest.path = 'assessment-question/get-question-list-by-purpose?purpose=systemAssessment';
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

    //submit answer
    $scope.submitAssessmentAnswer=function() {
        rest.path = 'assessment-question/submit-system-assessment';
        var data=JSON.stringify(assessmentData($scope.rating,$scope.questions.questionList));
        rest.postModel({"answerList":data}).then(function boltSuccess(response) {

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