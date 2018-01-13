/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */

angularBolt.controller('SiteLogoutController', ['$location', '$http', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', '$localStorage', function ($location, $http, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar, $localStorage) {

    // Logout
    boltLoadingGlobal();
    $localStorage.$reset();
    $rootScope.isActive = false;
    $rootScope.isAdmin = false;
    $http.defaults.headers.common.Authorization = null;
    $scope.error = false;
    $rootScope.access = true;
    $location.path('/access');

}]);