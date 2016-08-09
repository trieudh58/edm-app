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
            .when('/notification/:id',{
                controller:'notification',
                templateUrl:'../templates/notification.view.html'
            });
			// .otherwise({ redirectTo: '/' });
	});

	// create the controller and inject Angular's $scope
    App.factory('deleteNotification',function($http,$localStorage){
          return{
            delete:function(IDs){
              return $http({
                method:'DELETE',
                url:originPath+'',
                headers:{
                  'x-access-token':$localStorage.access_token
                },
                params:{
                  notificationIds:IDs,
                  // token:$localStorage.access_token
                }
              }).then(function(response){
                return response.data;
              },function(response){

              });
            }
          }
    })
    App.factory('getDrafts',function($http,$localStorage){
        return{
            get:function(){
                return $http({
                    method:'GET',
                    url:originPath+'/api/v1/admin/notifications/get-all-unsent',
                    headers:{
                        'x-access-token':$localStorage.access_token
                    }
                }).then(function(response){
                    return response.data;
                })
            }
        };
    });

    App.factory('getSentNotifications',function($http,$localStorage){
        return{
            get:function(){
                return $http({
                    method:'GET',
                    url:originPath+'/api/v1/admin/notifications/get-all-sent',
                    headers:{
                        'x-access-token':$localStorage.access_token
                    }
                }).then(function(response){
                    return response.data;
                })
            }
        };
    });
	App.controller('HomeController', function($scope,getDrafts,getSentNotifications,$location) {
        $scope.ngSwitch='default';
        $scope.switchView=  function(param){
                $scope.ngSwitch=param;
                console.log($scope.ngSwitch);
            }

        getDrafts.get().then(function(response){
            $scope.draftsNotification=response.data;
            console.log($scope.draftsNotification);
        });
        getSentNotifications.get().then(function(response){
            $scope.sentNotification=response.data;
            console.log('sent', $scope.sentNotification);
        });

        $scope.redirect= function(path){
            $location.path(path);
          };

        $scope.refresh=function(){
            $route.reload();
          };

        $scope.clickAll=function($event){
            var element= angular.element($event.target);
            var allChecker=element.children(0);
            if(allChecker.hasClass('fa-square-o')){
              angular.element('.notificationCheckbox').prop('checked', true);
            }
            else
            angular.element('.notificationCheckbox').attr('checked',false);
            allChecker.toggleClass('fa-square-o');
            allChecker.toggleClass('fa-check-square-o');
            
          };

        $scope.deleteNotifications=function(){
            var idList=angular.element('.notificationCheckbox:checked').map(function() {
            return this.value;
            }).get();
            angular.element('.notificationCheckbox:checked').attr('checked',false).parent().parent().hide();
            deleteNotification.delete(idList.join(','));
          }

        $scope.timeConvert=function(inputdate){
            var datecurrent=new Date($.now());
            var date= new Date(inputdate);
            var seconds= (datecurrent-date)/1000;
            var outtime=''
            if(seconds<60)
                outtime='vài giây trước';
            else if(seconds<3600)
                outtime= Math.round(seconds/60) + ' phút trước';
            else if(seconds<86400)
                outtime= Math.round(seconds/3600)+ ' giờ trước';
            else if(seconds<86400*6)
                outtime=Math.round(seconds/86400)+' ngày trước';
            else
                outtime=date.toISOString().slice(0,10);
            return outtime;
          }
	});

	App.controller('LoginController', function($scope,$http,$rootScope,$location,$localStorage) {
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
                        $location.path('/');
                    }
                }, function myError(response) {
                    console.log($localStorage.access_token);
                    $scope.message.error='request fail';
                    console.log('fail');
                });
        };
       
	});
