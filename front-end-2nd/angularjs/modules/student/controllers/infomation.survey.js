/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */

angularBolt.controller('StudentInfomationSurveyController', ['$location', '$localStorage', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', function ($location, $localStorage, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.formData = {};
    if ($window.boltLoading) $window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    // Call api
    rest.path = 'student-survey/get-student-survey-question-list';
    rest.get().then(function boltSuccess(response) {

        if (response.data.success == true) {

            $scope.dataQuestions = response.data.questions;

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
        console.log(answerList);
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