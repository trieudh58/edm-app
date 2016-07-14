	// create the module and name it scotchApp
	var App = angular.module('app',['ngRoute','ngStorage']);
    var originPath='http://127.0.0.1:3001';
	// configure our routes
	App.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/home', {
				templateUrl : 'templates/home.view.html',
				controller  : 'HomeController',
                resolve: {
                    loginRequired: loginRequired
                }
			})

			// route for the about page
			.when('/login', {
				templateUrl : 'templates/login.view.html',
				controller  : 'LoginController',
                resolve:{
                    notLoginRequired:notLoginRequired
                }
			})

			// route for the contact page
			.when('/register', {
				templateUrl : 'templates/register.view.html',
				controller  : 'RegisterController',
                resolve:{
                    notLoginRequired:notLoginRequired
                }
			})
            .when('/logout', { 
                templateUrl: 'templates/login.view.html',
                controller: 'LogoutController',
                resolve:{
                    loginRequired:loginRequired
                }
            })
            .when('/profile',{
                templateUrl: 'templates/profiles.html',
                controller:ProfileController,
                resolve:{
                    //home page
                    //logged in
                }
            });

			//.otherwise({ redirectTo: '/' });
	});

	// create the controller and inject Angular's $scope
	App.controller('HomeController', function($scope,$localStorage) {
		// create a message to display in our view
		$scope.message={};
        console.log($localStorage.access_token);
	});

	App.controller('LoginController', function($scope, $http,$location,$localStorage,$window) {
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
                    if(response.data.success){
                        $localStorage.access_token=response.data.token;
                        console.log($localStorage.access_token);
                        console.log('logged in');
			$window.open('/home.html', "_self");
                    }
                }, function myError(response) {
                    $scope.myWelcome = response.statusText;
                    $scope.message.error='request fail';
                    console.log('fail');
                });
        };
	});

    App.controller('LogoutController',function($scope, $http,$location,$localStorage,$window){
	console.log('loged out');
        $localStorage.access_token=undefined;
        $window.open('/cover.html');
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
                    if(!response.data.success)
                        $scope.message.error=response.data.message;
                }, function myError(response) {
                    $scope.myWelcome = response.statusText;
                    $scope.message.error='request fail';
                });
            }
	    }
	});
    App.controller('ProfileController', function($scope,$http,$localStorage){
        
    })
    function loginRequired($q, $location,$localStorage) {           ///////////window instead
      var deferred = $q.defer();
      if ($localStorage.access_token!==undefined) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }
    
    function notLoginRequired($q, $location,$localStorage){
      var deferred = $q.defer();
      if ($localStorage.access_token==undefined) {
        deferred.resolve();
      } else {
        $location.path('/home');    ///////////////////// home.html
      }  
      return deferred.promise;
    }
