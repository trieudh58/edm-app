	// create the module and name it scotchApp
	var App = angular.module('app', ['ngRoute','ngStorage','angular-jwt','course.request','notification.service','token.services']);
	var originPath='http://localhost:3001';
	// configure our routes
	App.config(function($routeProvider,$httpProvider,jwtOptionsProvider) {
		$routeProvider
            .when('/notification/:id',{
                controller:'notification',
                templateUrl:'templates/notifications/notification.view.html'
            })
            .when('/draftnotifications',{
                controller:'draftNotifications',
                templateUrl:'templates/notifications/draft.view.html'
            })
            .when('/sentnotification',{
                controller:'sentNotification',
                templateUrl:'templates/notifications/sentnotifications.view.html'
            }).
            when('/createnotification',{
                controller:'createNotification',
                templateUrl:'templates/notifications/create.notification.html'
            })
            .when('/courserequestlist',{
                controller:'courseRequestList',
                templateUrl:'templates/courseRequests/course.request.view.list.html'
            })
            .when('/courserequest/:id',{
                controller:'courseRequest',
                templateUrl:'templates/notifications/notification.view.html'
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
    App.run(function($rootScope,$location,deleteNotification,$http,$route,$window){
        $rootScope.logout=function(){
            localStorage.clear();
            $window.open('/admin', "_self");
        }
        $rootScope.emailTrim =function(email){
            if(email)
            return email.split('@')[0];
          }
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
    App.controller('createNotification',function(notificationService,getStudentGroup,$scope,$route,$rootScope){
        getStudentGroup.get().then(function(res){
            $scope.studentGroups=res.data;
        })
        $scope.notificationData={};

        $scope.createNotification=function(){
            console.log('create');
            notificationService.createnotification($scope.notificationData.studentGroups.join(','),$scope.notificationData.title,$scope.notificationData.body);
            $rootScope.refresh();
        }
        $scope.sendNotification=function(){
            console.log('send');
            notificationService.sendNotification($scope.notificationData.studentGroups.join(','),$scope.notificationData.title,$scope.notificationData.body);
            $rootScope.refresh();
        }
    });
	App.controller('draftNotifications', function($scope,getDrafts) {

        getDrafts.get().then(function(response){
            $scope.draftsNotification=response.data;
        });
	});
    App.controller('sentNotification',function($scope,getSentNotifications){
        getSentNotifications.get().then(function(response){
            $scope.sentNotification=response.data;
        });
    });
    App.controller('courseRequest',function($scope,courseRequestService){
    });
    App.controller('courseRequestList',function($scope,courseRequestService){
        courseRequestService.getPendingRequests().then(function(response){
            $scope.requestList=response.data;
        });
        $scope.taskButton='pendingList';
        $scope.getPendingRequests=function($event){
            courseRequestService.getPendingRequests().then(function(response){
            $scope.requestList=response.data;
            });
            var element= angular.element($event.target).parent();
            element.siblings().removeClass('active');
            element.addClass('active');
            $scope.taskButton='pendingList';
        };
        $scope.getDeniedRequests=function($event){
            courseRequestService.getDeniedRequests().then(function(response){
                $scope.requestList=response.data;
            });
            var element= angular.element($event.target).parent();
            element.siblings().removeClass('active');
            element.addClass('active');
            $scope.taskButton='deniedList';
        };
        $scope.getPublicRequests=function($event){
            courseRequestService.getPublicRequests().then(function(response){
                $scope.requestList=response.data;
            });
            var element= angular.element($event.target).parent();
            element.siblings().removeClass('active');
            element.addClass('active');
            $scope.taskButton='publicList';
        }
        $scope.publicRequests=function($index,requestId){
            courseRequestService.putPublicRequest(requestId);
            $scope.requestList.pop($index);
        };
        $scope.denyRequests=function($index,requestId){
            courseRequestService.putDenyRequest(requestId);
            $scope.requestList.pop($index);
        }
        $scope.expectimeConvert=function(time){
            if(time=='Moring')
                return 'Buổi sáng';
            if(time=='Afternoon')
                return 'Buổi chiều';
            else
                return'Buổi tối';
        }
    });