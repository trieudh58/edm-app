var App =angular.module('token.services',[]);
App.factory('refreshToken',function($http){
    return{
        refreshToken:function(){
            return $http({
                method:'GET',
                url:originPath+'/api/v1/tokens/refresh',
                headers:{
                    Authorization:'Bearer '+localStorage.getItem('refresh_token')
                }
            }).then(response=> {
                return response.data;
            },err=>{
                console.log('get refresh tokens fail!');
            })
        }
    }
});

App.factory('revoke',function($http){
    return{
    revoke:function(){
        return $http({
            method:'POST',
            url:originPath+'/api/v1/tokens/revoke',
            headers:{
                Authorization:'Bearer '+localStorage.getItem('refresh_token')
            }
        }).then(response=> {
            return response.data;
        },err=>{
            console.log('get revoke tokens fail!');
        })
    }
  }
});