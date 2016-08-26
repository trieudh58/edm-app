    var App= angular.module('notification.service',[]);
    App.factory('deleteNotification',function($http){
          return{
            delete:function(IDs){
              return $http({
                method:'DELETE',
                url:originPath+'/api/v1/admin/notifications/delete-by-ids',
                params:{
                  notificationIds:IDs,
                }
              }).then(function(response){
                return response.data;
              },function(response){

              });
            }
          }
    });
    App.factory('getDrafts',function($http){
        return{
            get:function(){
                return $http({
                    method:'GET',
                    url:originPath+'/api/v1/admin/notifications/get-all-unsent'
                }).then(function(response){
                    return response.data;
                })
            }
        };
    });
    App.factory('getSentNotifications',function($http){
        return{
            get:function(){
                return $http({
                    method:'GET',
                    url:originPath+'/api/v1/admin/notifications/get-all-sent'
                }).then(function(response){
                    return response.data;
                })
            }
        };
    });

    App.factory('notificationService',function($http){
        return {
            createNotification:function(targetGroupIds,title,body){
                return $http({
                    method:'POST',
                    url:originPath+'/api/v1/admin/notifications/create',
                    data:{
                        targetGroupIds:targetGroupIds,
                        title:title,
                        body:body
                    }
                }).then(function(response){
                    return response.data;
                })
            },
            sendNotification:function(targetGroupIds,title,body){
                return $http({
                    method:'POST',
                    url:originPath+'/api/v1/admin/notifications/create-and-send',
                    data:{
                        targetGroupIds:targetGroupIds,
                        title:title,
                        body:body
                    }
                }).then(function(response){
                    return response.data;
                })
            }
        }
    });

