var App = angular.module('user.services',[]);
App.factory('getStudentInfor',function($http){
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
    }
  };
})
