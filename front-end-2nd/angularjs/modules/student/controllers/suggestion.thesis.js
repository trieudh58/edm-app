
 
angularBolt.controller('StudentSuggestionThesisController', ['$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function ($location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    rest.path='recommendations/get-recommended-thesis';
    rest.get().then(function boltSuccess(response){
    	if(response.data.success){
    		$scope.suggestedSupervisors= response.data.data;
    	}
    	else{
    		apiError(response);
    	}
    	
    },function boltError(response){
    	apiError(response);
    });
}]);