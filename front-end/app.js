(function () {
    'use strict';
    
    angular.module('app', ['ngRoute', 'ngCookies']).config(config);
    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/suc', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
            })
            .when('/',{
                templateUrl:'register/registersuccess.html'
            })
            .otherwise({ redirectTo: '/login' });
            $locationProvider.html5Mode(true);
    }
    
})();