

angularBolt.controller('StudentDashboardController', ['$timeout', '$location', '$localStorage', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', function ($timeout, $location, $localStorage, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    if ($window.boltLoading) {
        $timeout(function () {
            $window.boltLoading.finish()
        }, 500);
    }

    $scope.colorsLine = ['#26A69A'];
    if (!$rootScope.statusBarData && !$rootScope.dataLine) {

        rest.path = 'subjects/get-names-and-credits'
        rest.get().then(function boltSuccess(response) {
            if (response.data.success == true) {

                $scope.subjectCredits = subjectCredit(response.data.subjects);

                //get student records
                rest.path = 'student-records/get';
                rest.get().then(function boltSuccess(response) {
                    if (response.data.success) {

                        $scope.records = response.data.data.record;
                        $scope.semesterRecords = studentRecordInSenmester(response.data.data.record);
                        $scope.labelsLine = listSemester($scope.semesterRecords);
                        $rootScope.dataLine = GPASemesterList($scope.semesterRecords, $scope.subjectCredits);

                        rest.path = 'education-programs/get-ep-detail-by-code';
                        rest.getWithParams({epCode: 1}).then(function boltSuccess(response) {
                            if (response.data.success) {
                                $scope.educationProgramDetails = response.data.data;

                                rest.path = 'education-programs/get-kus';
                                rest.get().then(function boltSuccess(response) {
                                    if (response.data.success) {

                                        $scope.knowledgeUnitDetails = response.data.data;
                                        $rootScope.statusBarData = statusBarData($scope.educationProgramDetails, $scope.knowledgeUnitDetails, $scope.records, $scope.subjectCredits);
                                    }
                                    else {
                                        apiError(response);
                                    }
                                }, function boltError(response) {
                                    apiError(response);
                                });
                            }
                            else
                                apiError(response);
                        }, function boltError(response) {
                            apiError(response);
                        })

                        var suggestions = getStudyQualitySuggestion($scope.records,$scope.semesterRecords,$scope.subjectCredits);
                        $scope.suggestionList =suggestions[0];
                        $scope.conditionList = suggestions[1];
                    }
                    else {
                        apiError(response)
                    }
                }, function boltError(response) {
                    apiError(response)
                })
            }
            else {
                apiError(response)
            }
        }, function boltError(response) {
            apiError(response)
        })
    }


    // rest.path = 'suggestion-and-warning/current-performance';
    // rest.get().then(function boltSuccess(response) {
    //     if (response.data.success) {
    //         $scope.suggestionList = response.data.suggestions;
    //         //console.log($scope.suggestionList);


    //     }
    //     else {
    //         apiError(response);
    //     }
    // }, function boltError(response) {
    //     apiError(response);
    // });

    // rest.path = 'suggestion-and-warning/graduation-condition';
    // rest.get().then(function boltSuccess(response) {
    //     if (response.data.success) {
    //         $scope.conditionList = response.data.suggestions;
    //         //console.log($scope.conditionList);

    //     }
    //     else {
    //         apiError(response);
    //     }
    // }, function boltError(response) {
    //     apiError(response);
    // });

}]);
