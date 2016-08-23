	// create the module and name it scotchApp
	// var App = angular.module('app',['ngRoute','ngStorage','chart.js']);

    var App = angular.module('app',['ngRoute','ngStorage','angular-jwt']);
    var originPath='http://127.0.0.1:3001';
	// configure our routes
	App.controller('LoginController', function($scope,$rootScope,$http,$location,$localStorage,$window,jwtHelper) {
        $scope.message={}
        $scope.login =function() {
                $http({
                    method : "POST",
                    url : originPath+"/api/v1/users/authenticate",
                    data:{email:$scope.email,
                        password:$scope.password}
                }).then(function mySuccess(response) {
                    if(response.data.success){
                        $localStorage.access_token=response.data.token;
			            $window.open('/home', "_self");
                    }
                }, function myError(response) {
                    $scope.myWelcome = response.statusText;
                    $scope.message.error='request fail';
                    console.log('fail');
                });
        };
        $scope.loginShow=true;
        $scope.toggle=function(){
            $scope.loginShow=!$scope.loginShow;
        }
	});

	App.controller('RegisterController', function($scope,$http) {
		// $scope.message = 'Everyone come and see how good I look! register';
            $scope.message={}
            $scope.register=function() {
                $http({
                    method : "POST",
                    url : originPath+"/api/v1/users/register",
                    data:{email:$scope.email,
                        password:$scope.password}
                }).then(function mySuccess(response) {
                    $scope.myWelcome = response.data;
                    if(!response.data.success)
                        $scope.message.error=response.data.message;
                }, function myError(response) {
                    $scope.myWelcome = response.statusText;
                    $scope.message.error='request fail';
                });
            }
	});
