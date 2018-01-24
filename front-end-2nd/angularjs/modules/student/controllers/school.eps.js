
angularBolt.controller('StudentSchoolEpsController', ['NgTableParams', '$location', '$localStorage', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', function (NgTableParams, $location, $localStorage, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.kus = {};
    $scope.subjects = {};
    if ($window.boltLoading) $window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    // Call api
    rest.path = 'education-programs/get-eps';
    rest.get().then(function boltSuccess(response) {

        if (response.data.success == true) {

            $scope.responseData = response.data.data


        } else {

            // Response error
            apiError(response);
        }

    }, function boltError(response) {

        // Response error
        apiError(response);

    });

    // Call api
    rest.path = 'education-programs/get-kus';
    rest.get().then(function boltSuccess(response) {

        if (response.data.success == true) {

            $.each(response.data.data, function (i, item) {
                $scope.kus[item.kuCode] = item.name;
            });

        } else {

            // Response error
            apiError(response);
        }

    }, function boltError(response) {

        // Response error
        apiError(response);

    });

    // Call api
    rest.path = 'subjects/get-names-and-credits';
    rest.get().then(function boltSuccess(response) {

        if (response.data.success == true) {

            $.each(response.data.subjects, function (i, item) {

                rest.path = 'subjects/get-info?subjectCode=' + item.code;
                rest.get().then(function boltSuccess(response) {

                    if (response.data.success == true) {

                        var subject = response.data.data;
                        $scope.subjects[subject.code] = subject;

                    } else {

                        // Response error
                        apiError(response);
                    }

                }, function boltError(response) {

                    // Response error
                    apiError(response);

                });

            });

        } else {

            // Response error
            apiError(response);
        }

    }, function boltError(response) {

        // Response error
        apiError(response);

    });

    // Call function
    $scope.setObject = function (name,key) {
        $scope.name = name;

        if (key == 0){
            $scope.bg = 'bg-info-300';
        }else if (key == 1){
            $scope.bg = 'bg-teal-300';
        }else if (key == 2){
            $scope.bg = 'bg-brown-300';
        }else if (key == 3){
            $scope.bg = 'bg-pink-300';
        }else if (key == 4){
            $scope.bg = 'bg-orange-300';
        }else if (key == 5){
            $scope.bg = 'bg-blue-300';
        }else if (key == 6){
            $scope.bg = 'bg-green-300';
        }
    }

    // Call function
    $scope.getEpDetail = function (code) {

        rest.path = 'education-programs/get-ep-detail-by-code?epCode=' + code;
        rest.get().then(function boltSuccess(response) {

            if (response.data.success == true) {

                $scope.epDetail = response.data.data

            } else {

                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    };


}]);