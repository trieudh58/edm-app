var App =angular.module('recommendation.services',[]);
App.factory('recommendationServices',function($http){
	return{
		studyPath:function(){
			return $http({
				method:'GET',
				url:originPath+'/api/v1/recommendations/get-study-path'
			}).then(response=>{
				return response.data
			},err=>{
				console.log('get study path Fail!');
			})
		},
		nextSemesterStudy:function(){
			return $http({
				method:'GET',
				url:originPath +'/api/v1/recommendations/get-next-semester-subjects'
			}).then(response=>{
				return response.data
			},err=>{
				console.log('get next semester study fail!');
			})
		}
	}
})