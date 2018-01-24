

angularBolt.controller('StudentRecommendationStudyController', ['$location', '$localStorage', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', function ($location, $localStorage, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.items = [];
    $scope.records = [];
    $scope.isset = [];
    $scope.semesters = [];
    $scope.semesters[1] = true;
    $scope.semesterUnique = [];
    $scope.switch = 0;
    if ($window.boltLoading) $window.boltLoading.finish();

    $scope.$on('$viewContentLoaded', function () {
        boltScript();

        // Custom page
        $('.timeline > li').velocity('transition.slideDownIn', {
            stagger: 300,
        });
    });

    // Get data
    rest.path = 'student-records/get';
    rest.get().then(function boltSuccess(response) {

        if (response.data.success == true) {

            // Response success
            var records = response.data.data.record;

            angular.forEach(records, function (value, key) {

                var score = value.attempt[0].score;
                var semester = value.attempt[0].semester;

                $scope.records[value.subjectCode] = [];
                $scope.records[value.subjectCode]['score'] = score;

                // Check semester -> passed
                $scope.semesters[semester] = ($scope.semesters.indexOf(semester) == -1) ? true : false;

                if (score < 4) {

                    $scope.records[value.subjectCode]['class'] = 'text-danger';
                    $scope.records[value.subjectCode]['char'] = 'F';

                } else if (4 <= score && score < 5) {
                    $scope.records[value.subjectCode]['class'] = 'text-pink-700';
                    $scope.records[value.subjectCode]['char'] = 'D';

                } else if (5 <= score && score < 5.5) {
                    $scope.records[value.subjectCode]['class'] = 'text-pink-300';
                    $scope.records[value.subjectCode]['char'] = 'D+';

                } else if (5.5 <= score && score < 6.5) {
                    $scope.records[value.subjectCode]['class'] = 'text-orange-700';
                    $scope.records[value.subjectCode]['char'] = 'C';

                } else if (6.5 <= score && score < 7) {
                    $scope.records[value.subjectCode]['class'] = 'text-orange-300';
                    $scope.records[value.subjectCode]['char'] = 'C+';

                } else if (7 <= score && score < 8) {
                    $scope.records[value.subjectCode]['class'] = 'text-blue-700';
                    $scope.records[value.subjectCode]['char'] = 'B';

                } else if (7 <= score && score < 8.5) {
                    $scope.records[value.subjectCode]['class'] = 'text-blue-300';
                    $scope.records[value.subjectCode]['char'] = 'B+';

                } else if (8.5 <= score && score < 9) {
                    $scope.records[value.subjectCode]['class'] = 'text-green-700';
                    $scope.records[value.subjectCode]['char'] = 'A';

                } else {
                    $scope.records[value.subjectCode]['class'] = 'text-green-400';
                    $scope.records[value.subjectCode]['char'] = 'A+';

                }

            });

            // Get data
            rest.path = 'recommendations/get-study-path';
            rest.get().then(function boltSuccess(response) {

                if (response.data.success == true) {

                    // Response success
                    $scope.items = response.data.data;

                    $scope.filterSemester = function (semester, items) {
                        var result = {};

                        angular.forEach(items, function (value, key) {
                            if (value.semester == semester) {
                                result[key] = value;
                            }

                        });
                        return result;
                    }

                    // Each data
                    angular.forEach($scope.items, function (value, key) {

                        // Check semester -> isset
                        $scope.isset[value.semester]= ($scope.semesters.indexOf(value.semester) == -1) ? true : false;

                        if ($scope.semesters[value.semester] != true) {

                            rest.path = 'score-predictions/predict-one-subject?subjectCode=' + value.subject;
                            rest.get().then(function boltSuccess(response) {

                                if (response.data.success == true) {

                                    var predictionScore = response.data.data.prediction.score;

                                    $scope.records[value.subject] = [];
                                    $scope.records[value.subject]['score'] = predictionScore;

                                    if (predictionScore < 4) {
                                        $scope.records[value.subject]['class'] = 'text-danger';
                                        $scope.records[value.subject]['char'] = 'F';

                                    } else if (4 <= predictionScore && predictionScore < 5) {
                                        $scope.records[value.subject]['class'] = 'text-pink-700';
                                        $scope.records[value.subject]['char'] = 'D';

                                    } else if (5 <= predictionScore && predictionScore < 5.5) {
                                        $scope.records[value.subject]['class'] = 'text-pink-300';
                                        $scope.records[value.subject]['char'] = 'D+';

                                    } else if (5.5 <= predictionScore && predictionScore < 6.5) {
                                        $scope.records[value.subject]['class'] = 'text-orange-700';
                                        $scope.records[value.subject]['char'] = 'C';

                                    } else if (6.5 <= predictionScore && predictionScore < 7) {
                                        $scope.records[value.subject]['class'] = 'text-orange-300';
                                        $scope.records[value.subject]['char'] = 'C+';

                                    } else if (7 <= predictionScore && predictionScore < 8) {
                                        $scope.records[value.subject]['class'] = 'text-blue-700';
                                        $scope.records[value.subject]['char'] = 'B';

                                    } else if (7 <= predictionScore && predictionScore < 8.5) {
                                        $scope.records[value.subject]['class'] = 'text-blue-300';
                                        $scope.records[value.subject]['char'] = 'B+';

                                    } else if (8.5 <= predictionScore && predictionScore < 9) {
                                        $scope.records[value.subject]['class'] = 'text-green-700';
                                        $scope.records[value.subject]['char'] = 'A';

                                    } else {
                                        $scope.records[value.subject]['class'] = 'text-green-400';
                                        $scope.records[value.subject]['char'] = 'A+';

                                    }

                                } else {

                                    // Response error
                                    apiError(response);
                                }

                            }, function boltError(response) {

                                // Response error
                                apiError(response);

                            });
                        }

                    });

                } else {

                    // Response error
                    apiError(response);
                }

            }, function boltError(response) {

                // Response error
                apiError(response);

            });


        } else {

            // Response error
            apiError(response);
        }

    }, function boltError(response) {

        // Response error
        apiError(response);

    });


    // Switch fuction
    $scope.switchFunction = function ($semester) {

        if($scope.switch == $semester){
            $scope.switch = 0;
        }else {
            $scope.switch = $semester;
        }
    }

}]);