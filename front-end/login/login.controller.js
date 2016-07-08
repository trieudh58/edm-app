(function () {
    'use strict';
angular
        .module('app',[])

        .controller('LoginController', function($scope, $http,$location) {
        console.log($http);
        $scope.message={}
        $scope.login =function() {
            data:{
                email: $scope.email,
                password: $scope.password
            };
            console.log(data);
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
            $http.post('http://127.0.0.1:3001/api/v1/users/authenticate', data, config)
            .success(function (data, status, headers, config) {
                    if(data.success)
                        $location.path('http://google.com');
                    else
                        $scope.message.error='your email or password not match';
            })
            .error(function (data, status, header, config) {
                $scope.message.error='fail to send request';
            });
        };
    }
);
})();
