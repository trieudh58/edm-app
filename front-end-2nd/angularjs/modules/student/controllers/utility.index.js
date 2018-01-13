/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */
 
angularBolt.controller('StudentUtilityIndexController', ['$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function ($location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });



}]);