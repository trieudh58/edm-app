

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