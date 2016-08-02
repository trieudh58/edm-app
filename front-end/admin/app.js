	// create the module and name it scotchApp
	var App = angular.module('app', ['ngRoute','ngStorage']);
	var originPath='http://localhost:3001';
	// configure our routes
	App.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/home', {
				templateUrl : 'templates/home.view.html',
				controller  : 'HomeController'
			})

			// route for the about page
			.when('/', {
				templateUrl : 'templates/login.view.html',
				controller  : 'LoginController'
			})
			.otherwise({ redirectTo: '/' });
	});

	// create the controller and inject Angular's $scope
	App.controller('HomeController', function($scope) {
		// create a message to display in our view
		$scope.message={};
	});

	App.controller('LoginController', function($scope,$http,$rootScope,$location,$localStorage) {
        $scope.message={}
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
			            $location.path('/home');
                    }
                }, function myError(response) {
                    $scope.myWelcome = response.statusText;
                    $scope.message.error='request fail';
                    console.log('fail');
                });
        };
       	$rootScope.logout=function(){
       		console.log('logout');
            $http({
                    method : "POST",
                    url : originPath+"/api/v1/users/logout",
                    data:{token:$localStorage.access_token}
                }).then(function mySuccess(response) {
                    if(response.data.success){
                        $localStorage.access_token=undefined;
                        $location.path('/admin/home');
                    }
                }, function myError(response) {
                    console.log($localStorage.access_token);
                    $scope.message.error='request fail';
                    console.log('fail');
                });
        };
       
	});