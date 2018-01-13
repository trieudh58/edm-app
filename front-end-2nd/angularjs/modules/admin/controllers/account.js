/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */
 
angularBolt.controller('AdminAccountController', ['$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function ($location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.formData = {};
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    $scope.searchAccount= function(query){
        rest.path="admin/users/find-account";
        rest.getWithParams({'query': query}).then(function boltSuccess(response) {
        if (response.data.success == true) {
            $scope.accountInfo=response.data.data;
        }
        else {
            apiError(response);
        }
        }, function boltError(response) {
            apiError(response);
        });
    }

    $scope.createAccount = function(data){
        rest.path = 'admin/users/create';
        rest.postModel(data).then(function boltSuccess(response) {
            if (response.data.success == true) {
                toastr.success('Tài khoản đã tạo', 'Thông báo');
            }
            else {
                apiError(response);
            }
            }, function boltError(response) {
                apiError(response);
            });
    }

    $scope.deleteAccount= function(index,email){
        rest.path="admin/users/delete";
        rest.deleteModel({'email': email}).then(function boltSuccess(response) {
        if (response.data.success == true) {
            $scope.accountInfo.splice(index,1);
        }
        else {
            apiError(response);
        }
        }, function boltError(response) {
            apiError(response);
        });
    }
    $scope.deactivateAccount= function(index,email){

        rest.path="admin/users/deactivate-user";
        rest.putModel({'email': email}).then(function boltSuccess(response) {
        if (response.data.success == true) {
            $scope.accountInfo[index].isActive= false;
        }
        else {
            apiError(response);
        }
        }, function boltError(response) {
            apiError(response);
        });
    }
    $scope.activateAccount= function(index,email){
        rest.path="admin/users/activate-user";
        rest.putModel({'email': email}).then(function boltSuccess(response) {
        if (response.data.success == true) {
            $scope.accountInfo[index].isActive = true;
        }
        else {
            apiError(response);
        }
        }, function boltError(response) {
            apiError(response);
        });
    }
}]);
