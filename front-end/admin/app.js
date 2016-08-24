	// create the module and name it scotchApp
	var App = angular.module('app', ['ngRoute','ngStorage','angular-jwt']);
	var originPath='http://localhost:3001';
	// configure our routes
	App.config(function($routeProvider,$httpProvider,jwtOptionsProvider) {
		$routeProvider
			.when('/', {
				templateUrl : 'templates/login.view.html',
				controller  : 'LoginController'
			});
        jwtOptionsProvider.config({
            tokenGetter: ['refreshToken','jwtHelper','options', function(refreshToken,jwtHelper,options) {
                if (options.url.substr(options.url.length - 5) == '.html' || options.url.substr(options.url.length - 3) == '.js' || options.url.substr(options.url.length - 4) == '.css' ) {
                    return null;
                }
                if(localStorage.id_token&&jwtHelper.isTokenExpired(localStorage.id_token)){
                    return refreshToken.refreshToken().then(function(response){
                        localStorage.setItem('id_token',response.accessToken);
                        localStorage.setItem('refresh_token',response.refreshToken);
                        return response.accessToken;
                    });
                }
                else if(localStorage.id_token) return localStorage.getItem('id_token');
                    else return null;
            }],
            whiteListedDomains: ['myapp.com', 'localhost','127.0.0.1']    
        });

        $httpProvider.interceptors.push('jwtInterceptor');
	});

    App.controller('LoginController', function($scope,$rootScope,$http,$location,$window) {
        $scope.message={}
        $scope.login =function() {
                $http({
                    method : "POST",
                    url : originPath+"/api/v1/users/authenticate",
                    skipAuthorization: true,
                    data:{email:$scope.email,
                        password:$scope.password}
                }).then(function mySuccess(response) {
                    if(response.data.success){
                        localStorage.id_token=response.data.accessToken;
                        localStorage.refresh_token=response.data.refreshToken;
                        $window.open('/admin/home', "_self");
                    }
                }, function myError(response) {
                    $scope.myWelcome = response.statusText;
                    $scope.message.error='request fail';
                    console.log('fail');
                });
        };
    });


    App.factory('refreshToken',function($http){
        return{
            refreshToken:function(){
                return $http({
                    method:'GET',
                    url:originPath+'/api/v1/tokens/refresh',
                    headers:{
                        Authorization:'Bearer '+localStorage.getItem('refresh_token')
                    }
                }).then(response=> {
                    return response.data;
                },err=>{
                    console.log('get refresh tokens fail!');
                })
            }
        }
    })