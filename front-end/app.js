    // create the module and name it
    var App = angular.module('app',['ngRoute','ngStorage','angular-jwt']);
    var originPath='http://localhost:3001';
	// configure our routes
	App.controller('LoginController', function($scope,$rootScope,$http,$location,$localStorage,$window,jwtHelper) {
    App.config(function Config($httpProvider,jwtOptionsProvider) {
    // Please note we're annotating the function so that the $injector works when the file is minified
    jwtOptionsProvider.config({
        tokenGetter: ['refreshToken','jwtHelper', function(refreshToken,jwtHelper) {
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
    })
    
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
