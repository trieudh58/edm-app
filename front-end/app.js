	// create the module and name it scotchApp
	var App = angular.module('app', ['ngRoute']);

	// configure our routes
	App.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'templates/home.view.html',
				controller  : 'HomeController'
			})

			// route for the about page
			.when('/login', {
				templateUrl : 'templates/login.view.html',
				controller  : 'LoginController'
			})

			// route for the contact page
			.when('/register', {
				templateUrl : 'templates/register.view.html',
				controller  : 'RegisterController'
			});
	});

	// create the controller and inject Angular's $scope
	App.controller('HomeController', function($scope) {
		// create a message to display in our view
		$scope.message={};
	});

	App.controller('LoginController', function($scope, $http,$location) {
		// $scope.message = 'Everyone come and see how good I look! login';
        console.log($http);
        $scope.message={}
        $scope.login =function() {

                $http({
                    method : "POST",
                    url : "http://127.0.0.1:3001/api/v1/users/authenticate",
                    data:{email:$scope.email,
                        password:$scope.password}
                }).then(function mySucces(response) {
                    $scope.myWelcome = response.data;
                    console.log('success');
                    console.log(response.data);
                    // $location.path('http://google.com');
                }, function myError(response) {
                    $scope.myWelcome = response.statusText;
                    $scope.message.error='request fail';
                    console.log('fail');
                });
        };
	});

	App.controller('RegisterController', function($scope,$http) {
		// $scope.message = 'Everyone come and see how good I look! register';
        $scope.register=function() {
            $scope.message={}
            $scope.register=function() {
                $http({
                    method : "POST",
                    url : "http://127.0.0.1:3001/api/v1/users/register",
                    data:{email:$scope.email,
                        password:$scope.password}
                }).then(function mySuccess(response) {
                    $scope.myWelcome = response.data;
                    if(!response.success)
                        $scope.message.error=response.data.message;
                }, function myError(response) {
                    $scope.myWelcome = response.statusText;
                    $scope.message.error='request fail';
                });
            }
	    }
	});