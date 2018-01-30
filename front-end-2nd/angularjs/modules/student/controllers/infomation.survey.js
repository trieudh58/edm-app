

angularBolt.controller('StudentInfomationSurveyController', ['$location', '$localStorage', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', function ($location, $localStorage, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.formData = {};
    if ($window.boltLoading) $window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });
    $scope.formData.rating = {};
    // Call api
    rest.path = 'student-survey/get-student-survey-question-list';
    rest.get().then(function boltSuccess(response) {

        if (response.data.success == true) {

            $scope.dataQuestions = response.data.questions;
            if(response.data.answers){
                $scope.formData = surveyAnswers(response.data.answers.answerList,$scope.dataQuestions);
            }
            for(i=0;i< $scope.dataQuestions.length;i++){
                if($scope.dataQuestions[i].questionType == 'rating'&&!$scope.formData.rating[$scope.dataQuestions[i]._id]){
                    $scope.formData.rating[$scope.dataQuestions[i]._id]= 1;
                }
            }
        } else {

            // Response error
            apiError(response);
        }

    }, function boltError(response) {
        // Response error
        apiError(response);

    });

    // Custom submit function triggered only when a valid form is submitted
    $scope.submitForm = function (formData) {
        //
        var answerList = JSON.stringify(surveySubmitAnswer(formData, $scope.dataQuestions))

        var data = {"answerList": answerList};
        rest.path = "student-survey/submit-student-survey";
        rest.postModel(data).then(function boltSuccess(response) {
            if (response.data.success) {
                toastr.success('Cập nhật thông tin thành công!', 'Thông báo');
            }
            else {

                toastr.warning('Cập nhật không thành công!', 'Thông báo');
            }
        })
    };

}]);