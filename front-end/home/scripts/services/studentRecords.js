var App =angular.module('student.records',[]);

App.factory('getStudentRecord',function($http){
  return{
    get:function(){
      return $http({
        method : "GET",
        url : originPath+"/api/v1/student-records/get"
    }).then(function mySuccess(response) {
        return response.data;
    }, function myError() {
         ////////!
    });
    }
  };
})