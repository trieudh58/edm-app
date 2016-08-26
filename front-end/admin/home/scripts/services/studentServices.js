	var App=angular.module('student.services',[]);
	App.factory('getStudentGroup',function($http){
        return{
            get:function(){
                return $http({
                    method:'GET',
                    url:originPath+'/api/v1/admin/student-groups/get-all'
                }).then(function(response){
                    return response.data;
                })
            }
        }
    });