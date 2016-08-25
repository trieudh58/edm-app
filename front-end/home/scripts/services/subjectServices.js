var App = angular.module('subject.services',[]);

App.factory('getSubjectNameAndCredits',function($http){
  return{
    get:function(){
      return $http({
        method : "GET",
        url : originPath+"/api/v1/subjects/get-names-and-credits"
    }).then(function(response){
      return response.data;
    },
     function myError() {
        //
    });
    }
  };
})

App.factory('getSubjectInfo',function($http){
  return{
    getSubjectInfo: function(){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/subjects/get-info'
      }).then(response=>{
        return response.data
      },err=>{
        console.log('get subject info fail');
      })
    }
  }
})