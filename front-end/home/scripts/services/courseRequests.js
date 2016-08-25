var App = angular.module('course.requests',[]);

App.factory('courseRequest',function($http){
  return{
    createCourseRequest:function(reason,subjectID,expectedtime){
      return $http({
        method:'POST',
        url:originPath+'/api/v1/course-requests/create',
        data:{
          subjectId:subjectID,
          expectedTime:expectedtime,
          reason:reason
        }
      }).then(function(response){
        return response.data;
      },function(){
        return {
          success:false,
          message:'Create Request Fail!'
        };
      });
    },
    getPublicCourseRequests:function(){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/course-requests/get-all-public'
      }).then(function(response){
        return response.data;
      });
      /////////////////////////////////////////////////////////////
    },
    getOwnRequestCreated:function(){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/course-requests/get-own-created'
      }).then(function(response){
        return response.data;
      })
    },
    getOwnRequestPublic:function(){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/course-requests/get-own-public'
      }).then(function(response){
        return response.data;
      })
    },
    getOwnRequestPending:function(){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/course-requests/get-own-pending',
      }).then(function(response){
        return response.data;
      })
    },
    getOwnRequestDenied:function(){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/course-requests/get-own-denied',
      }).then(function(response){
        return response.data;
      })
    },
    getOneById:function(id){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/course-requests/get-own-denied',
        params:{
          courseRequestId:id
        }
      }).then(function(response){
        return response.data;
      })
    },
    deleteOneById:function(id){
      return $http({
        method:'DELETE',
        url:originPath+'/api/v1/course-requests/delete-one',
        params:{
          courseRequestId:id
        }
      })
    },
    putJoinOneById:function(id){
      return $http({
        method:'PUT',
        url:originPath+'/api/v1/course-requests/join',
        data:{
          courseRequestId:id
        }
      })
    },
    putUnJoinOneById:function(id){
      return $http({
        method:'DELETE',
        url:originPath+'/api/v1/course-requests/undo-join',
        data:{
          courseRequestId:id
        }
      })
    }
  }
});
