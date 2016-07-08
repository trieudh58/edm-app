(function () {
    'use strict';
    angular
        .module('app',[])
        .controller('RegisterController',function($scope, $http) {
            $scope.register=function() {
                var config = {
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };
                data:{email:$scope.email,password:$scope.password};
                $http.post('http://127.0.0.1:3001/api/v1/users/register', data, config)
                    .success(function (data, status, headers, config) {
                       console.log('success register');
                    })
                    .error(function (data, status, header, config) {
                        console.log('error register');
                    });
            }
    }
    );
})();
