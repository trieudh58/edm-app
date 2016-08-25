var App = angular.module('notification.services',[]);

App.factory('getNotifications',function($http){
  return{
    getImportantNotification:function(){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/notifications/get-important-titles'
      }).then(function(response){
        return response.data;
      },function(response){
        //////////// fail
      });
    },
    getUnread:function(){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/notifications/get-unread-titles'
      }).then(function(response){
        return response.data;
      },function(response){
        //////////// fail
      });
    },
    getAllNotifications:function(){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/notifications/get-titles'
      }).then(function(response){
        return response.data;
      },function(response){
        //////////// fail
      });
    },
    getSomeNewNotifications: function(){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/notifications/get-5-latest-titles',
      }).then(function(response){
        return response.data;
      },function(response){
      });
    }
  };
});

App.factory('getNotification',function($http){
  return{
    get:function(ID){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/notifications/get-by-id',      /////// lost
        params:{
          notificationId:ID
        }
      }).then(function(response){
        return response.data;
      },function(response){
        //////////// fail
      });
    }
  };
});

App.factory('deleteNotification',function($http){
  return{
    delete:function(IDs){
      return $http({
        method:'DELETE',
        url:originPath+'/api/v1/notifications/delete',
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

App.factory('notitificationStateChange',function($http){
  return{
    putMarkAsUnImportant:function(id){
      return $http({
        method:'PUT',
        url:originPath+'/api/v1/notifications/mark-one-as-unimportant',
        data:{
          notificationId:id
        }
      }).then(function(response){
        return response.data;
      },function(response){

      });
    },
    putMarkAsImportant:function(id){
      return $http({
        method:'PUT',
        url:originPath+'/api/v1/notifications/mark-one-as-important',
        data:{
          notificationId:id
        }
      }).then(function(response){
        return response.data;
      },function(response){

      });
    },
    putMarkAsUnRead:function(id){
      return $http({
        method:'PUT',
        url:originPath+'/api/v1/notifications/mark-one-as-unread',
        data:{
          notificationId:id
        }
      }).then(function(response){
        return response.data;
      },function(response){

      });
    },
    putMarkAsRead:function(id){
      return $http({
        method:'PUT',
        url:originPath+'/api/v1/notifications/mark-one-as-read',
        data:{
          notificationId:id
        }
      }).then(function(response){
        return response.data;
      },function(response){

      });
    },
    putMarkAllAsRead:function(){
      return $http({
        method:'PUT',
        url:originPath+'/api/v1/notifications/mark-all-as-read',
      }).then(function(response){
        return response.data;
      },function(response){

      });
    }
  }
});