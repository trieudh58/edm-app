var App =angular.module('education.programs',[]);

App.factory('educationPrograms',function($http){
	return {
		getEducationProgramDetails:function(epcode){
			return $http({
				method:'GET',
				url:originPath+'/api/v1/education-programs/get-ep-detail-by-code',
				params:{
					epCode:epcode
				}
			}).then(response=>{
				return response.data;
			},err=>{console.log('get education program fail!')})
		},
		getKnowledgeUnitDetails:function(){
			return $http({
				method:'GET',
				url:originPath+'/api/v1/education-programs/get-kus'
			}).then(response=>{
				return response.data;
			},err=>{
				console.log('knowledge unit get fail!');
			})
		}
	}
})