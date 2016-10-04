var App = angular.module('user.services',[]);
App.factory('userServices',function($http){
  return{
    get:function(){
      return $http({
        method:'GET',
        url :originPath+'/api/v1/users/get'
      }).then(function(response){
        return response.data;
      },function(){
        return 'Request Fail' ////////////
      });
    },
    changePassword:function(newPassword,oldPassword){
      return $http({
        method:'PUT',
        url:originPath+'/api/v1/users/change-password',
        data:{
          newPassword:newPassword,
          oldPassword:oldPassword
        }
      }).then(response=>{
        return response.data;
      },err=>{
        return null;
      })
    }
  };
})
