/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */
 
angularBolt.controller('AdminStatisticController', ['$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function ($location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    // Line chart
    $scope.labelsBar = [1, 2, 3, 4, 5];
    $scope.dataBar = [450, 350, 350, 400, 350,0];

    // Line chart
    $scope.labelsLine = ["Spring 2015", "Summer 2015", "Fall 2015", "Spring 2016", "Summer 2016", "Fall 2016"];
    $scope.dataLine = [
        [250, 350, 350, 400, 350, 450]
    ];

}]);