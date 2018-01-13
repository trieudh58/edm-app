/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */

angularBolt.controller('StudentInfomationScoreController', ['$location', '$localStorage', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', function ($location, $localStorage, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    if ($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    if ($location.hash() == 'password') {
        $scope.profileIndex = 1;
    } else {
        $scope.profileIndex = 0;
    }
    rest.path='subjects/get-names-and-credits';
    rest.get().then(function boltSuccess(response){
        if(response.data.success){
            $scope.subjectCredits=subjectCredit(response.data.subjects);
            $scope.subjectsNameDictViet=subjectDictViet(response.data.subjects);
            rest.path='student-records/get';
            rest.get().then(function boltSuccess(response){
                if(response.data.success)
                    $scope.records=studentRecordInSenmester(response.data.data.record); // need to sort by semester
                else
                    apiError(response);
            },function boltError(response){
                apiError(response);
            });
        }
        else{
            apiError(response);
        }
    },function boltError(response){
        apiError(response);
    });

}]);