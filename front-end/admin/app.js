	// create the module and name it scotchApp
	var App = angular.module('app', ['ngRoute','ngStorage']);
	var originPath='http://localhost:3001';
	// configure our routes
	App.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl : 'templates/login.view.html',
				controller  : 'LoginController'
			});
            // .otherwise({ redirectTo: '/' });
	});

	App.controller('LoginController', function($scope,$http,$rootScope,$location,$localStorage,$window) {
        $scope.message={};
        $scope.login =function() {
                $http({
                    method : "POST",
                    url : originPath+"/api/v1/users/authenticate",
                    data:{email:$scope.email,
                        password:$scope.password}
                }).then(function mySuccess(response) {
                    $scope.myWelcome = response.data;
                    if(response.data.success){
                        $localStorage.access_token=response.data.token;
			            $window.open('/admin/home', "_self");
                    }
                }, function myError(response) {
                    $scope.myWelcome = response.statusText;
                    $scope.message.error='request fail';
                    console.log('fail');
                });
        };
	});
