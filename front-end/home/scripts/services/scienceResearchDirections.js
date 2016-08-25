var App=angular.module('science.research.directions',[]);
App.factory('scienceResearchDirections',function($http){
	return{
		researchThesisInfo:function(){
			return $http({
				method:'GET',
				url:originPath+'/api/v1/science-research-directions/get-list'
			}).then(response=>{
				return response.data;
			},err=>{
				console.log('get science-research-direction fail!');
			})
		}
	}
})