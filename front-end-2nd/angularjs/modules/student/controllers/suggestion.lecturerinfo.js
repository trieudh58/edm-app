
 
angularBolt.controller('StudentSuggestionLecturerInfoController', ['NgTableParams','$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function (NgTableParams,$location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.lecturers = {};
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {

        // Bolt script
        boltScript();

        // Select
        //$('select').select2({minimumResultsForSearch:1/0,width:'auto'});

    });

    // Call api
    rest.path='science-research-directions/get-lecturers';
    rest.get().then(function boltSuccess(response){
        if(response.data.success){

            $scope.lecturers = convertLecturersArray(response.data.data);
        }
        else{
            apiError(response);
        }
    },function boltError(response){
        apiError(response);
    });

    // Call api
    rest.path='science-research-directions/get-list';
    rest.get().then(function boltSuccess(response){
    	if(response.data.success){

            $scope.tableParams = new NgTableParams({}, {
                dataset: convertLecturerInfoArray(response.data.data)
            });
    	}
    	else{
    		apiError(response);
    	}
    },function boltError(response){
    	apiError(response);
    })


}]);