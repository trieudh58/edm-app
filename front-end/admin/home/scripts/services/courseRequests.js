   var App=angular.module('course.request',[]);
   App.factory('courseRequestService',function($http){
        return{
            getPublicRequests:function(){
                return $http({
                    method:'GET',
                    url:originPath+'/api/v1/admin/course-requests/get-all-public'
                }).then(function(response){
                    return response.data;
                },function(){

                });
            },
            getOneCourseRequest:function(id){
                return $http({
                    method:'GET',
                    url: originPath +'/api/v1/admin/course-requests/get-all-denied'
                });
            },
            getDeniedRequests:function(){
                return $http({
                    method:'GET',
                    url:originPath+'/api/v1/admin/course-requests/get-all-denied'
                }).then(function(response){
                    return response.data;
                });
            },
            getPendingRequests:function(){
                return $http({
                    method:'GET',
                    url:originPath+'/api/v1/admin/course-requests/get-all-pending'
                }).then(function(response){
                    return response.data;
                },function(){

                });
            },
            putDenyRequest:function(id){
                return $http({
                    method:'PUT',
                    url:originPath+'/api/v1/admin/course-requests/deny-one',
                    data:{
                        courseRequestId:id
                    }
                }).then(function(response){
                    return response.data;
                });
            },
            putPublicRequest:function(id){
                return $http({
                    method:'PUT',
                    url:originPath+'/api/v1/admin/course-requests/public-one',
                    data:{
                        courseRequestId:id
                    }
                }).then(function(response){
                    return response.data;
                });
            }
         }
    });