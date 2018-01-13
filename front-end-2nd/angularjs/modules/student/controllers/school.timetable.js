/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */

angularBolt.controller('StudentSchoolTimetableController', ['NgTableParams','$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function (NgTableParams,$location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    // Call api

    if(!$rootScope.timeTableData){
        rest.path= 'time-tables/get-school-time-table';
        rest.get().then(function boltSuccess(response){
            if(response.data.success==true){
                $rootScope.timeTableData= timeTableData(response.data.data);
                $rootScope.timeTableParams = new NgTableParams({}, {
                    dataset: $rootScope.timeTableData
                });
            }
            else{
                apiError(response);
            }
        },function boltError(response){
            apiError(response);
        });
    }
}]);