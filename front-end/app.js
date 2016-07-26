	// create the module and name it scotchApp
	// var App = angular.module('app',['ngRoute','ngStorage','chart.js']);

    var App = angular.module('app',['ngRoute','ngStorage']);
    var originPath='http://127.0.0.1:3001';
	// configure our routes

	// App.config(function($routeProvider,ChartJsProvider) {

	// create the controller and inject Angular's $scope

	App.controller('LoginController', function($scope,$rootScope,$http,$location,$localStorage,$window) {
		// $scope.message = 'Everyone come and see how good I look! login';
        // console.log('localStorage'+ $localStorage);
        // console.log('rootScope'+$rootScope);
        // console.log($http);

        $scope.message={}
        $scope.login =function() {
                $http({
                    method : "POST",
                    url : originPath+"/api/v1/users/authenticate",
                    data:{email:$scope.email,
                        password:$scope.password}
                }).then(function mySuccess(response) {
                    $scope.myWelcome = response.data;
                    console.log(response);
                    console.log(response.data);
                    console.log(response.data.success);
                    if(response.data.success){
                        $localStorage.access_token=response.data.token;
                        console.log($localStorage.access_token);
                        console.log('logged in');
			            $window.open('/home', "_self");
                    }
                }, function myError(response) {
                    $scope.myWelcome = response.statusText;
                    $scope.message.error='request fail';
                    console.log('fail');
                });
        };
        // $rootScope.logout=function(){
        //     $http({
        //             method : "POST",
        //             url : originPath+"/api/v1/users/logout",
        //             data:{token:$localStorage.access_token}
        //         }).then(function mySuccess(response) {
        //             // $scope.myWelcome = response.data;
        //             if(response.data.success){
        //                 $localStorage.access_token=undefined;
        //                 $window.open('/', "_self");
        //             }
        //         }, function myError(response) {
        //             // $scope.myWelcome = response.statusText;
        //             console.log($localStorage.access_token);
        //             $scope.message.error='request fail';
        //             console.log('fail');
        //         });
        //     }
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
