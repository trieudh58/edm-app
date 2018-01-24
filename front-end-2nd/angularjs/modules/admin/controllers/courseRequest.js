
 
angularBolt.controller('CourseRequestController', ['NgTableParams','$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function (NgTableParams,$location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.formData = {};
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    $scope.getPublicRequests=function(){
		rest.path= 'admin/course-requests/get-all-public';
		rest.get().then(function boltSuccess(response) {
        if (response.data.success == true) {
            $scope.requestList = response.data.data;
            $scope.requestListTable = new NgTableParams({}, {
                dataset: $scope.requestList
            });
        }
        else {
            apiError(response);
        }
        }, function boltError(response) {
            apiError(response);
        });
    },
    // $scope.getOneCourseRequest=function(id){
    // 	rest.path= 'admin/course-requests/get-all-denied';
    // },
    $scope.getDeniedRequests=function(){
		rest.path= 'admin/course-requests/get-all-denied';
		rest.get().then(function boltSuccess(response) {
        if (response.data.success == true) {
            $scope.requestList = response.data.data;
            $scope.requestListTable = new NgTableParams({}, {
                dataset: $scope.requestList
            });
        }
        else {
            apiError(response);
        }
        }, function boltError(response) {
            apiError(response);
        });
    },
    $scope.getPendingRequests=function(){
		rest.path= 'admin/course-requests/get-all-pending';
		rest.get().then(function boltSuccess(response) {
        if (response.data.success == true) {
            $scope.requestList = response.data.data;
            $scope.requestListTable = new NgTableParams({}, {
                dataset: $scope.requestList
            });            
        }
        else {
            apiError(response);
        }
        }, function boltError(response) {
            apiError(response);
        });
    },

    $scope.getPendingRequests();
    $scope.deleteRequest =function(id,index){
    	apiError('not Implemented');
    	// rest.path="admin/course-requests/add-to-pending";
    	// rest.putModel({courseRequestId:id}).then(function boltSuccess(response) {
     //    if (response.data.success == true) {
     //        // $scope.accountInfo=response.data.data;
     //    }
     //    else {
     //        apiError(response);
     //    }
     //    }, function boltError(response) {
     //        apiError(response);
     //    });
    }
    $scope.putDenyRequest=function(id,index){
        rest.path='admin/course-requests/deny-one',

        rest.putModel({courseRequestId:id}).then(function boltSuccess(response) {
        if (response.data.success == true) {
            $scope.requestList.splice(index,1);
            $scope.requestListTable = new NgTableParams({}, {
                dataset: $scope.requestList
            });      
        }
        else {
            apiError(response);
        }
        }, function boltError(response) {
            apiError(response);
        });
    },
    $scope.putPublicRequest=function(id,index){

    	rest.path="admin/course-requests/public-one";
        rest.putModel({courseRequestId:id}).then(function boltSuccess(response) {
        if (response.data.success == true) {
            $scope.requestList.splice(index,1);
            $scope.requestListTable = new NgTableParams({}, {
                dataset: $scope.requestList
            });      
        }
        else {
            apiError(response);
        }
        }, function boltError(response) {
            apiError(response);
        });
    }
    $scope.passRequestData= function(index){
    	$scope.requestDetail = $scope.requestList[index];
    }
}]);