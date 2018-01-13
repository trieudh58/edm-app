/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */
 
angularBolt.controller('StudentSuggestionSrdController', ['NgTableParams','$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function (NgTableParams,$location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {

        // Bolt script
        boltScript();

        // Select
        //$('select').select2({minimumResultsForSearch:1/0,width:'auto'});

    });

    // Call api
    rest.path='recommendations/get-recommended-research-topics';
    rest.get().then(function boltSuccess(response){
    	if(response.data.success){

            $scope.responseData = response.data.data
    	}
    	else{
    		apiError(response);
    	}
    },function boltError(response){
    	apiError(response);
    });



}]);