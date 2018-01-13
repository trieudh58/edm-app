/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */

angularBolt.controller('AdminDataController', ['$location', '$localStorage', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', function ($location, $localStorage, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    if ($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    // Modal
    $scope.groups = [{value: 1, label: 'Group 1'}, {value: 2, label: 'Group 2'}, {value: 3, label: 'Group 3'}, {value: 4, label: 'Group 4'}];


}]);