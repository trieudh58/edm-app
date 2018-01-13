/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */

angularBolt.controller('AdminDashboardController', ['$timeout', '$location', '$localStorage', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', function ($timeout, $location, $localStorage, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    if ($window.boltLoading) {
        $timeout(function () {
            $window.boltLoading.finish()
        }, 1000);
    }

    // Line chart
    $scope.labelsLine = ["Spring 2015", "Summer 2015", "Fall 2015", "Spring 2016", "Summer 2016", "Fall 2016"];
    $scope.dataLine = [
        [250, 350, 350, 400, 350, 450]
    ];

    // Pie chart
    $scope.labelsPie1 = ["Đã xử lý", "Chưa xử lý"];
    $scope.dataPie1 = [130, 60];
    $scope.labelsPie2 = ["Đã chấp nhận", "Đang chờ","Đã từ chối"];
    $scope.dataPie2 = [170, 50, 90];

    // Doughnu chart
    $scope.labelsDoughnut = ["Đã đã kích hoạt", "Chưa kích hoạt"];
    $scope.dataDoughnut = [130, 60];

}]);