﻿	// create the module and name it scotchApp
	// var App = angular.module('app',['ngRoute','ngStorage','chart.js']);

    var App = angular.module('app',['ngRoute','ngStorage','chart.js', 'ui.bootstrap']);
    var originPath='http://127.0.0.1:3001';
	// configure our routes

	// App.config(function($routeProvider,ChartJsProvider) {
    App.config(function($routeProvider,ChartJsProvider) {
		$routeProvider

			// route for the home page
			.when('/home', {
				templateUrl : '../templates/home.view.html',
				controller  : 'HomeController',
                resolve: {
                    loginRequired: loginRequired
                }
			})

			// route for the about page
			.when('/login', {
				templateUrl : '../templates/login.view.html',
				controller  : 'LoginController',
                resolve:{
                    notLoginRequired:notLoginRequired
                }
			})

			// route for the contact page
			.when('/register', {
				templateUrl : '../templates/register.view.html',
				controller  : 'RegisterController',
                resolve:{
                    notLoginRequired:notLoginRequired
                }
			})
      .when('/profile',{
          templateUrl: '../templates/profile.html',
          controller:'ProfileController',
          resolve:{
              //home page
              //logged in
          }
      })
      .when('/studentscore',{
          // controller:'LineCtrl',
          // controller:'studentscore',
          templateUrl:'../templates/student.score.html'
      })
      .when('/subjects',{
        controller:'subjects',
        templateUrl:'../templates/subject.view.html'
      })
      .when('/tem',{
          // controller:'LineCtrl',
          templateUrl:'../templates/tem.html'
      })
      ;
            // $locationProvider.html5Mode(true);

        // ChartJsProvider.setOptions({
        //   colours: ['#97BBCD', '#DCDCDC', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
        //   responsive: true
        // });
        // // Configure all doughnut charts
        // ChartJsProvider.setOptions('Doughnut', {
        //   animateScale: true
        // });
			//.otherwise({ redirectTo: '/' });
       ChartJsProvider.setOptions({
      colours: ['#97BBCD', '#DCDCDC', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
      responsive: true
    });
    // Configure all doughnut charts
    ChartJsProvider.setOptions('Doughnut', {
      animateScale: true
    });
	});

	// create the controller and inject Angular's $scope
	App.controller('HomeController', function($scope,$localStorage) {
		// create a message to display in our view
		$scope.message={};
        console.log($localStorage.access_token);
	});

	App.controller('LoginController', function($scope,$rootScope,$http,$location,$localStorage,$window) {
		// $scope.message = 'Everyone come and see how good I look! login';
        // console.log('localStorage'+ $localStorage);
        // console.log('rootScope'+$rootScope);
        // console.log($http);

        $scope.message={}
        $scope.login =function() {
                $http({
                    method : "POST",
                    url : originPath+"/api/v1/users/authenticate",
                    data:{email:$scope.email,
                        password:$scope.password}
                }).then(function mySuccess(response) {
                    $scope.myWelcome = response.data;
                    if(response.data.success){
                        $localStorage.access_token=response.data.token;
                        console.log($localStorage.access_token);
                        console.log('logged in');
			             $window.open('/home', "_self");
                    }
                }, function myError(response) {
                    $scope.myWelcome = response.statusText;
                    $scope.message.error='request fail';
                    console.log('fail');
                });
        };
        $rootScope.logout=function(){
            $http({
                    method : "POST",
                    url : originPath+"/api/v1/users/logout",
                    data:{token:$localStorage.access_token}
                }).then(function mySuccess(response) {
                    if(response.data.success){
                        $localStorage.access_token=undefined;
                        $window.open('/', "_self");
                    }
                }, function myError(response) {
                    console.log($localStorage.access_token);
                    $scope.message.error='request fail';
                    console.log('fail');
                });
            }
	});

 //    App.controller('LogoutController',function($scope, $http,$location,$localStorage,$window){
	// console.log('loged out');
 //        $scope.logout=function(){
 //        $http({
 //                method : "POST",
 //                url : originPath+"/api/v1/users/logout",
 //                data:{token:$localStorage.access_token}
 //            }).then(function mySuccess(response) {
 //                // $scope.myWelcome = response.data;
 //                if(response.data.success){
 //                    $localStorage.access_token=undefined;
 //                    $window.open('/cover.html', "_self");
 //                }
 //            }, function myError(response) {
 //                // $scope.myWelcome = response.statusText;
 //                $scope.message.error='request fail';
 //                console.log('fail');
 //            });
 //        }
 //    });

  App.controller('ProfileController', function($scope,$http,$localStorage){

  })
  function loginRequired($q, $location,$localStorage) {           ///////////window instead
    var deferred = $q.defer();
    if ($localStorage.access_token!==undefined) {
      deferred.resolve();
    } else {
      $location.path('/login');
    }
    return deferred.promise;
  }
  
  function notLoginRequired($q, $location,$localStorage){
    var deferred = $q.defer();
    if ($localStorage.access_token==undefined) {
      deferred.resolve();
    } else {
      $location.path('/home');    ///////////////////// home.html
    }  
    return deferred.promise;
  }



App.controller("studentscore",function($scope,$http,$localStorage){
    $http({
        method : "GET",
        url : 'http://localhost:3001'+"/api/v1/student-records/get",
        params:{
            'token':$localStorage.access_token
        }
    }).then(function mySuccess(response) {
        if(response.data.success){
            $scope.records=studentRecordInSenmester(response.data.data.record);
            // line chart data
            console.log($scope.records);
            $scope.linelabels = listSemester($scope.records);
            $scope.lineseries = ['Trung binh tich luy'];
            $scope.linedata = diemtichluycacky($scope.records);

        }
    }, function myError(response) {
        $scope.message.error='request fail';
    });
    $http({
        method : "GET",
        url : 'http://localhost:3001'+"/api/v1/subjects/get-names",
        params:{
            'token':$localStorage.access_token
        }
    }).then(function mySuccess(response) {
        if(response.data.success){
            $scope.subjectsNameDictViet=subjectDictViet(response.data.subjects);
            // $scope.subjectsNameDictEng=subjectDictEng(response.data.subjects);
        }
    }, function myError(response) {
        $scope.message.error='request fail';
    });
});

App.controller('subjects',function($scope,$http){
  $http({

  }).then(function(response){

  },function(response){

  });
});
// App.controller("LineCtrl",function ($scope, $timeout,$http,$localStorage) {
//     console.log($localStorage.access_token);
//     $scope.message={}
//     // $http.defaults.headers.common.Authorization = 'Basic YmVlcDpib29w';
    
//         $http({
//         method : "GET",
//         url : 'http://localhost:3001'+"/api/v1/student-records/get",
//         // headers:{
//         //     'x-access-token':$localStorage.access_token
//         // }
//         params:{
//             'token':$localStorage.access_token
//         }
//     }).then(function mySuccess(response) {
//         // $scope.myWelcome = response.data;
//         if(response.data.success){
//             $scope.recodes=response.data
//             // console.log(response)
//         }
//     }, function myError(response) {
//         // $scope.myWelcome = response.statusText;
//         $scope.message.error='request fail';
//         // console.log('fail');
//         // console.log(response.data)
//     });

// });
  // $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  // $scope.series = ['Series A', 'Series B'];
  // $scope.data = [
  //   [65, 59, 80, 81, 56, 55, 40],
  //   [28, 48, 40, 19, 86, 27, 90]
  // ];
  // $scope.onClick = function (points, evt) {
  //   console.log(points, evt);
  // };

  // Simulate async data update
  App.controller('LineCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    // $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    // $scope.series = ['Series A', 'Series B'];
    // $scope.data = [
    //   [65, 59, 80, 81, 56, 55, 40],
    //   [28, 48, 40, 19, 86, 27, 90]
    // ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.onHover = function (points) {
      if (points.length > 0) {
        console.log('Point', points[0].value);
      } else {
        console.log('No point');
      }
    };

    // $timeout(function () {
    //   $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    //   $scope.data = [
    //     [28, 48, 40, 19, 86, 27, 90],
    //     [65, 59, 80, 81, 56, 55, 40]
    //   ];
    //   $scope.series = ['Series C', 'Series D'];
    // }, 3000);
  }]);

  // app.controller('BarCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
  //   $scope.options = { scaleShowVerticalLines: false };
  //   $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  //   $scope.series = ['Series A', 'Series B'];
  //   $scope.data = [
  //     [65, 59, 80, 81, 56, 55, 40],
  //     [28, 48, 40, 19, 86, 27, 90]
  //   ];
  //   $timeout(function () {
  //     $scope.options = { scaleShowVerticalLines: true };
  //   }, 3000);
  // }]);

  // app.controller('DoughnutCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
  //   $scope.labels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  //   $scope.data = [0, 0, 0];

  //   $timeout(function () {
  //     $scope.data = [350, 450, 100];
  //   }, 500);
  // }]);

  // app.controller('PieCtrl', function ($scope) {
  //   $scope.labels = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  //   $scope.data = [300, 500, 100];
  // });

  // app.controller('PolarAreaCtrl', function ($scope) {
  //   $scope.labels = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
  //   $scope.data = [300, 500, 100, 40, 120];
  // });

  // app.controller('BaseCtrl', function ($scope) {
  //   $scope.labels = ['Download Sales', 'Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
  //   $scope.data = [300, 500, 100, 40, 120];
  //   $scope.type = 'PolarArea';

  //   $scope.toggle = function () {
  //     $scope.type = $scope.type === 'PolarArea' ?  'Pie' : 'PolarArea';
  //   };
  // });

  App.controller('RadarCtrl', function ($scope) {
    $scope.labels = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

    $scope.data = [
      [65, 59, 90, 81, 56, 55, 40],
      [28, 48, 40, 19, 96, 27, 100]
    ];

    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
  });

  // app.controller('StackedBarCtrl', function ($scope) {
  //   $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  //   $scope.type = 'StackedBar';

  //   $scope.data = [
  //     [65, 59, 90, 81, 56, 55, 40],
  //     [28, 48, 40, 19, 96, 27, 100]
  //   ];
  // });

  // app.controller('TabsCtrl', function ($scope) {
  //   $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  //   $scope.active = true;
  //   $scope.data = [
  //     [65, 59, 90, 81, 56, 55, 40],
  //     [28, 48, 40, 19, 96, 27, 100]
  //   ];
  // });

  // app.controller('DataTablesCtrl', function ($scope) {
  //   $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  //   $scope.data = [
  //     [65, 59, 80, 81, 56, 55, 40],
  //     [28, 48, 40, 19, 86, 27, 90]
  //   ];
  //   $scope.colours = [
  //     { // grey
  //       fillColor: 'rgba(148,159,177,0.2)',
  //       strokeColor: 'rgba(148,159,177,1)',
  //       pointColor: 'rgba(148,159,177,1)',
  //       pointStrokeColor: '#fff',
  //       pointHighlightFill: '#fff',
  //       pointHighlightStroke: 'rgba(148,159,177,0.8)'
  //     },
  //     { // dark grey
  //       fillColor: 'rgba(77,83,96,0.2)',
  //       strokeColor: 'rgba(77,83,96,1)',
  //       pointColor: 'rgba(77,83,96,1)',
  //       pointStrokeColor: '#fff',
  //       pointHighlightFill: '#fff',
  //       pointHighlightStroke: 'rgba(77,83,96,1)'
  //     }
  //   ];
  //   $scope.randomize = function () {
  //     $scope.data = $scope.data.map(function (data) {
  //       return data.map(function (y) {
  //         y = y + Math.random() * 10 - 5;
  //         return parseInt(y < 0 ? 0 : y > 100 ? 100 : y);
  //       });
  //     });
  //   };
  // });

  // app.controller('TicksCtrl', ['$scope', '$interval', function ($scope, $interval) {
  //   var maximum = document.getElementById('container').clientWidth / 2 || 300;
  //   $scope.data = [[]];
  //   $scope.labels = [];
  //   $scope.options = {
  //     animation: false,
  //     showScale: false,
  //     showTooltips: false,
  //     pointDot: false,
  //     datasetStrokeWidth: 0.5
  //   };

  //   // Update the dataset at 25FPS for a smoothly-animating chart
  //   $interval(function () {
  //     getLiveChartData();
  //   }, 40);

  //   function getLiveChartData () {
  //     if ($scope.data[0].length) {
  //       $scope.labels = $scope.labels.slice(1);
  //       $scope.data[0] = $scope.data[0].slice(1);
  //     }

  //     while ($scope.data[0].length < maximum) {
  //       $scope.labels.push('');
  //       $scope.data[0].push(getRandomValue($scope.data[0]));
  //     }
  //   }
  // }]);

  function getRandomValue (data) {
    var l = data.length, previous = l ? data[l - 1] : 50;
    var y = previous + Math.random() * 10 - 5;
    return y < 0 ? 0 : y > 100 ? 100 : y;
  }
  function subjectDictViet(subjectJsonData){
    result={}
    for (i=0;i<subjectJsonData.length;i++){
      result[subjectJsonData[i].code]=subjectJsonData[i].name.vi;
    }
    // console.log(result);
    return result;
  }
  function subjectDictEng(subjectJsonData){
    result={}
    for (i=0;i<subjectJsonData.length;i++){
      result[subjectJsonData[i].code]=subjectJsonData[i].name.en;
    }
    // console.log(result);
    return result;
  }
  function studentRecordInSenmester(records){
    result={};
    for(i=0;i<records.length;i++){
        var semester=records[i].attempt[records[i].attempt.length-1].semester;
        if(semester in result){
          result[semester].push({
            subjectCode:records[i].subjectCode,
            score:records[i].attempt[records[i].attempt.length-1].score,
            score4:studentRecord4(records[i].attempt[records[i].attempt.length-1].score),
            scoreChar:studentRecordChar(studentRecord4(records[i].attempt[records[i].attempt.length-1].score))
            });
        }
        else{
          result[semester]=[];
          result[semester].push({subjectCode:records[i].subjectCode,
                                score:records[i].attempt[records[i].attempt.length-1].score,
                                score4:studentRecord4(records[i].attempt[records[i].attempt.length-1].score),
                                scoreChar:studentRecordChar(studentRecord4(records[i].attempt[records[i].attempt.length-1].score))});
        }
    }
    // console.log(result['1.2014-2015'][1]);
    return result;
  }
  function diemtichluycacky(records){
    // result=[];
    // for(var key in records) {
    //   records[key]
    // }
    return [3.4,3.2,3.3];
  }
  function listSemester(records){
    var keys = []
    for(var key in records) keys.push( key );
    console.log(keys);
    return keys;
  }

  function studentRecord4(score){
    if(score>=9)
      return 4.0;
    if(score>=8.5)
      return 3.7;
    if(score>=8.0)
      return 3.5;
    if(score>=7.0)
      return 3.0;
    if(score>=6.5)
      return 2.5;
    if(score>=5.5)
      return 2.0;
    if(score>=5.0)
      return 1.5;
    if(score>=4.0)
      return 1.0;
    return 0
  }
  function studentRecordChar(score){
    if(score==4.0)
      return 'A+';
    if(score==3.7)
      return 'A';
    if(score== 3.5)
      return 'B+';
    if(score==3.0)
      return 'B';
    if(score==2.5)
      return'C+';
    if(score==2.0)
      return 'C';
    if(score==1.5)
      return 'D+';
    if(score==1.0)
      return 'D';
    if(score== 0)
      return 'F';

  }
