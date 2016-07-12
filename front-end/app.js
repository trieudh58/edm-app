	// create the module and name it scotchApp
	var App = angular.module('app',['ngRoute','ngStorage']);
    var originPath='http://127.0.0.1:3001'
	// configure our routes
	App.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'templates/home.view.html',
				controller  : 'HomeController',
                resolve: {
                    loginRequired: loginRequired
                }
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
			})
			.otherwise({ redirectTo: '/' });
	});

	// create the controller and inject Angular's $scope
	App.controller('HomeController', function($scope,$localStorage) {
		// create a message to display in our view
		$scope.message={};
        console.log($localStorage.access_token);
	});

	App.controller('LoginController', function($scope, $http,$location,$localStorage) {
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
                    console.log(response.data);
                    if(response.success){
                        $localStorage.access_token=response.data.token;
                        console.log('logged in');
                    }
                    $location.path('http://google.com');
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
                    url : originPath+"/api/v1/users/register",
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
    function loginRequired($localStorage) {
      // var deferred = $q.defer();
      // if ($auth.isAuthenticated()) {
      //   deferred.resolve();
      // } else {
      //   $location.path('/login');
      // }
      return ($localStorage.access_token!==undefined);
    }
    function loginRequired($q, $location,$localStorage) {
      var deferred = $q.defer();
      if ($localStorage.access_token!==undefined) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }