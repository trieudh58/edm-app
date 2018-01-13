/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */

angularBolt.controller('SiteAccessController', ['$location', '$http', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', '$localStorage', function ($location, $http, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar, $localStorage) {

    // Initial
    $rootScope.access = true;
    $scope.formData = {};
    $scope.accessIndex = $location.search().action == 'register' ? 1 : 0;

    if ($localStorage.isAdmin == true) {
        $rootScope.access = false;
        if ($window.boltLoading) {
            $timeout(function () {
                $window.boltLoading.finish()
            }, 1000);
        }
        $location.path('/admin/dashboard');


    }

    if ($localStorage.isAdmin == false) {
        $rootScope.access = false;
        if ($window.boltLoading) {
            $timeout(function () {
                $window.boltLoading.finish()
            }, 1000);
        }
        $location.path('/student/dashboard');
    }

    if ($window.boltLoading) $window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    // Declare error
    var loginError = function (response) {
        console.log(response);
        $window.boltLoading.finish();
        $scope.loginError = true;
    }
    var registerError = function (response) {
        console.log(response);
        $window.boltLoading.finish();
        $scope.registerError = true;
    }
    var verifyError = function (response) {
        console.log(response);
        $window.boltLoading.finish();
        $scope.verifyError = true;
    }

    // Active login tab
    $scope.activeLoginTab = function () {
        $scope.accessIndex = 0;
    }

    // Validate rule
    $scope.validationRules = {
        email: {
            type: 'email',
            required: true,
        },
        password: {
            type: 'password',
            required: true,
        },
        repassword: {
            custom: function (value, formData) {
                return formData.password === formData.repassword;
            }
        }
    };

    // Post login
    $scope.postLogin = function (formData) {

        boltLoadingGlobal();
        rest.path = 'users/authenticate';
        rest.postModel(formData).then(function boltSuccess(response) {

            if (response.data.success == true) {

                // Response success
                $localStorage.accessToken = response.data.accessToken;
                $localStorage.refreshToken = response.data.refreshToken;
                $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.accessToken;

                // Get account
                rest.path = 'users/get';
                rest.get().then(function boltSuccess(response) {

                        // Response success
                        $localStorage.isActive = response.data.data.isActive;
                        $localStorage.isAdmin = response.data.data.isAdmin;
                        $localStorage.fullName = response.data.data.personalInfo.fullName;
                        $localStorage.email = response.data.data.email;
                        $rootScope.isActive = response.data.data.isActive;
                        $rootScope.isAdmin = response.data.data.isAdmin;
                        $rootScope.personalInfo.fullName = response.data.data.personalInfo.fullName ? response.data.data.personalInfo.fullName : 'Noname';
                        $rootScope.personalInfo.profilePicture = response.data.data.personalInfo.profilePicture ? response.data.data.personalInfo.profilePicture : 'assets/images/placeholder.jpg';
                        $rootScope.access = false;
                        $localStorage.profilePicture = $rootScope.personalInfo.profilePicture;

                        if ($rootScope.isAdmin == true) {
                            $location.path('/admin/dashboard');

                        } else {
                            $location.path('/student/dashboard');

                        }


                    }, function boltError(response) {

                        // Response error
                        loginError(response);

                    }
                );

            } else {

                // Response error
                loginError(response);
            }

        }, function boltError(response) {

            // Response error
            loginError(response);

        });
    }

    // Post register
    $scope.postRegister = function (formData) {

        boltLoadingGlobal();
        rest.path = 'users/register';
        rest.postModel(formData).then(function boltSuccess(response) {

            if (response.data.success == true) {

                // Response success
                $scope.registerSuccess = true;
                $window.boltLoading.finish();

            } else {

                // Response error
                registerError(response);
            }

        }, function boltError(response) {

            // Response error
            registerError(response);

        });
    }

    // Action verify
    if ($location.search().action == 'verify') {

        var formData = {
            email: $location.search().email,
            token: $location.search().token
        }

        rest.path = 'users/verify-email';
        rest.putModel(formData).then(function boltSuccess(response) {

            if (response.data.success == true) {

                // Response success
                $window.boltLoading.finish();
                $scope.verifySuccess = true;

            } else {

                // Response error
                verifyError(response);
            }

        }, function boltError(response) {

            // Response error
            verifyError(response);

        });
    }


}]);