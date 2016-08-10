	// create the module and name it scotchApp
	var App = angular.module('app', ['ngRoute','ngStorage']);
	var originPath='http://localhost:3001';
	// configure our routes
	App.config(function($routeProvider) {
		$routeProvider
            .when('/notification/:id',{
                controller:'notification',
                templateUrl:'templates/notification.view.html'
            })
            .when('/draftnotifications',{
                controller:'draftnotifications',
                templateUrl:'templates/draft.view.html'
            })
            .when('/sentnotification',{
                controller:'sentNotification',
                templateUrl:'templates/sentnotifications.view.html'
            })
            .when('/courseRequestList',{
                controller:'courseRequestList',
                templateUrl:'templates/course.request.view.list.html'
            }).
            when('/createnotification',{
                controller:'createnotification',
                templateUrl:'templates/create.notification.html'
            });
			// .otherwise({ redirectTo: '/' });
	});

	// create the controller and inject Angular's $scope
    App.run(function($rootScope,$location,deleteNotification,$http,$localStorage,$route){
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
                    console.log('fail');
                });
        };
        $rootScope.redirect= function(path){
            $location.path(path);
          };

        $rootScope.refresh=function(){
            $route.reload();
          };

        $rootScope.clickAll=function($event){
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

        $rootScope.deleteNotifications=function(){
            var idList=angular.element('.notificationCheckbox:checked').map(function() {
            return this.value;
            }).get();
            angular.element('.notificationCheckbox:checked').attr('checked',false).parent().parent().hide();
            deleteNotification.delete(idList.join(','));
          }

        $rootScope.timeConvert=function(inputdate){
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
    App.factory('notificationCreate',function($http,$localStorage){
        return{
            post:function(title,body,targetGroupIds){
                return $http({
                    method:'POST',
                    url:originPath+'/api/v1/admin/notifications/create',
                    data:{
                        title:title,
                        body:body,
                        targetGroupIds:targetGroupIds,
                        token:$localStorage.access_token
                    }
                }).then(function(response){
                    return response.data
                },function(response){
                    //fail
                });
            }
        };
    })
    App.factory('courseRequestList',function($http ,$localStorage){
        return{
            get:function(){
                return $http({
                    method:'GET',
                    url:originPath+''
                }).then(function(response){

                },function(){

                });
            }
         }
        });

    App.factory('deleteNotification',function($http,$localStorage){
          return{
            delete:function(IDs){
              return $http({
                method:'DELETE',
                url:originPath+'/',
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
    App.factory('createnotification',function($http,$localStorage){
        return function(){
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
    })
    App.controller('createnotification',function(createnotification,$rootScope){

    });

	App.controller('draftnotifications', function($scope,getDrafts) {

        getDrafts.get().then(function(response){
            $scope.draftsNotification=response.data;
        });
	});
    App.controller('sentNotification',function($scope,getSentNotifications){
        getSentNotifications.get().then(function(response){
            $scope.sentNotification=response.data;
        });
    });
