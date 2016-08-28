    var App = angular.module('app',['ngRoute','ngStorage','angular-jwt']);
    var originPath='http://localhost:3001';
	// configure our routes
    App.config(function Config($httpProvider,$routeProvider,jwtOptionsProvider) {

        $routeProvider
        .when('/verify',{
          controller:'verifyCtrl'
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
                        $window.open('/home', "_self");
                    }
                    else{
                        $scope.message.error='Email hoặc mật khẩu không đúng!';
                    }
                }, function myError(response) {
                    if(response.status == 400){
                        $scope.message.error="Email hoặc mật khẩu không đúng!";
                    }
                    else
                        $scope.message.error='Request fail!';
                });
        };
        $scope.registerToggle=function(){
            var loginModal=angular.element('#loginModal');
            var registerModal=angular.element('#registerModal');
            loginModal.modal('hide');
            registerModal.modal('show');
        };
    });

    App.controller('RegisterCtrl', function($scope,$http) {
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
                    if(!response.data.success){
                        $scope.message.error=response.data.message;
                    }
                    else{
                        $scope.message.success='Đăng ký thành công! Kiểm tra mail để kích hoạt tài khoản';
                    }
                }, function myError(response) {
                    if(response.status == 400){
                        $scope.message.error="Email không hợp lệ!";
                    }
                    else{
                        $scope.message.error='Request fail!';
                    }
                });
            }
            $scope.loginToggle=function(){
            var loginModal=angular.element('#loginModal');
            var registerModal=angular.element('#registerModal');
            registerModal.modal('hide');
            loginModal.modal('show');
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
    });

    App.controller('verifyCtrl',function($http,$scope,$routeParams,$location){
        var qs = $location.search();
        $http({
            method:'PUT',
            url:originPath+'/api/v1/users/verify-email',
            data:{
                'email':qs.email,
                'token':qs.token
            }
        }).then(function success(response){
             $scope.response=response.data;
        },function error(response){
            $scope.response='Request fail!';
        });
        var Modal=angular.element('#verifyModal');
        Modal.modal('show');
    });
