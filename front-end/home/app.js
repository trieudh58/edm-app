	// create the module and name it scotchApp
    var App = angular.module('app',['ngRoute','ngStorage','chart.js', 'ui.bootstrap']);
    // var originPath='http://127.0.0.1:3001';
    var originPath='http://localhost:3001';
	// configure our routes
    App.config(function($routeProvider,ChartJsProvider) {
		$routeProvider
			// route for the about page
			// .when('/login', {
			// 	templateUrl : '../templates/login.view.html',
			// 	controller  : 'LoginController',
   //              resolve:{
   //                  notLoginRequired:notLoginRequired
   //              }
			// })
      .when('/verify',{
        templateUrl:'../templates/verify.html',
        controller:'verify'
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
      // .when('/tem',{
      //     // controller:'LineCtrl',
      //     templateUrl:'../templates/tem.html'
      // })
      .when('/allnotifications',{
        controller:'allnotifications',
        templateUrl:'../templates/view.all.notifications.html'
      })
      .when('/notification/:id',{
        controller:'notification',
        templateUrl:'../templates/notification.view.html'
      })
      .when('/courserequest',{
        controller:'courserequest',
        templateUrl:'../templates/courserequest.view.html'
      })
      ;
            // #$locationProvider.html5Mode(true);
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

  App.controller('verify',function($http,$scope,$routeParams,$location){
     var qs = $location.search();
     console.log(qs);
    $http({
      method:'PUT',
      url:originPath+'/api/v1/users/verify-email',
      params:{
            'token': qs.token,
            'email':qs.email
        }
    }).then(function success(response){
      $scope.response=response.data;
    },function error(response){
        $scope.response='request fail!';
    });
  })
	App.controller('LoginController', function($scope,$rootScope,$http,$localStorage,$window,getSomeNewNotifications) {
        $scope.message={}
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
        var newFeeds=getSomeNewNotifications.get();
        newFeeds.then(function(res){
          $rootScope.newFeeds=res.data.latest;
          $rootScope.unReadFeads=res.data.unread;
        });
	});

  App.controller('ProfileController', function($scope,$http,$localStorage){
      //////profile
  });

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

App.factory('getSubjectNameAndCredits',function($http,$localStorage){
  return{
    get:function(){
      return $http({
        method : "GET",
        url : originPath+"/api/v1/subjects/get-names-and-credits",
        params:{
            'token':$localStorage.access_token
        }
    }).then(function(response){
      // console.log(response.data);
      return response.data;
    },
     function myError(response) {
        $scope.message.error='request fail';          //////////////////!
    });
    }
  };
})

App.factory('getStudentRecord',function($http,$localStorage){
  return{
    get:function(){
      return $http({
        method : "GET",
        url : originPath+"/api/v1/student-records/get",
        params:{
            'token':$localStorage.access_token
        }
    }).then(function mySuccess(response) {
        return response.data;
    }, function myError(response) {
        $scope.message.error='request fail'; ////////!
    });
    }
  };
})

App.factory('getStudentInfor',function($http,$localStorage){
  return{
    get:function(){
      return $http({
        method:'GET',
        url :originPath+'/api/v1/users/get',
        params:{
          token:$localStorage.access_token
        }
      }).then(function(response){
        return response.data;
      },function(response){
        $scope.message.error='request fail'; /////////???!
      });
    }
  };
})


App.controller("studentscore",function($scope,$rootScope,getSubjectNameAndCredits,getStudentRecord){

    var res=getSubjectNameAndCredits.get();
    var studentRecordRequest=getStudentRecord.get();
    res.then(function(response){
      $scope.subjectCredits=subjectCredit(response.subjects);
      $scope.subjectsNameDictViet=subjectDictViet(response.subjects);
      studentRecordRequest.then(function(res){
            $scope.records=studentRecordInSenmester(res.data.record);  // rootscope //////////// need to sort the semester !!!
            //semester GPA line chart data
            $scope.linelabels = listSemester($scope.records);
            $scope.lineseries = ['Trung binh tich luy'];
            $scope.linedata = GPASemesterList($scope.records,$scope.subjectCredits);
            //A B C D percentage pie chart data
            [$scope.ABCDPielabels,$scope.ABCDPiedata] = ABCDPieChartData($scope.records,$scope.subjectCredits);
      });
    });
});

App.controller('subjects',function($scope,$http){
  $http({

  }).then(function(response){

  },function(response){

  });
});



App.factory('getSomeNewNotifications',function($http,$localStorage){
  return{
    get: function(){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/notifications/get-5-latest-titles',
        params:{
          token:$localStorage.access_token
        }
      }).then(function(response){
        return response.data;
      },function(response){
      });
    }
  };
})

App.factory('getAllNotifications',function($http,$localStorage){
  return{
    get:function(){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/notifications/get-titles',      /////// lost
        params:{
          token:$localStorage.access_token
        }
      }).then(function(response){
        return response.data;
      },function(response){
        //////////// fail
      });
    }
  };
});
App.factory('markNotificationAsImportant',function($http,$localStorage){
  return{
    put:function(id){
      return $http({
        method:'PUT',
        url:originPath+'/api/v1/notifications/mark-one-as-important',
        data:{
          token:$localStorage.access_token,
          notificationId:id
        }
      }).then(function(response){
        return response.data;
      },function(response){

      });
    }
  }
});
App.factory('deleteNotification',function($http,$localStorage){
  return{
    delete:function(IDs){
      return $http({
        method:'DELETE',
        url:originPath+'/api/v1/notifications/delete',
        headers:{
          'x-access-token':$localStorage.access_token
        },
        data:{
          notificationIds:IDs
        }
      }).then(function(response){
        return response.data;
      },function(response){

      });
    }
  }
});
App.factory('markNotificationAsUnImportant',function($http,$localStorage){
  return{
    put:function(id){
      return $http({
        method:'PUT',
        url:originPath+'/api/v1/notifications/mark-one-as-unimportant',
        data:{
          token:$localStorage.access_token,
          notificationId:id
        }
      }).then(function(response){
        return response.data;
      },function(response){

      });
    }
  }
});

App.factory('getImportantNotifications',function($http,$localStorage){
  return{
    get:function(){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/notifications/get-important-titles',
        params:{
          token:$localStorage.access_token
        }
      }).then(function(response){
        return response.data;
      },function(response){
        //////////// fail
      });
    }
  }
})
App.controller('allnotifications',function($scope,$route,getAllNotifications,getImportantNotifications,deleteNotification,markNotificationAsImportant,markNotificationAsUnImportant,$location){
  var request=getAllNotifications.get();
  request.then(function(response){
    $scope.notifications=response.data; 
  });
  // $('.fa').attr('class','gg');
  $scope.redirect= function(path){
    $location.path(path);
  };

  $scope.refresh=function(){
      $route.reload();
  };

  $scope.clickAll=function($event){
    var element= angular.element($event.target);
    var allChecker=element.children(0);
    if(allChecker.hasClass('fa-square-o')){
      angular.element('.notificationCheckbox').prop('checked', true);
    }
    else
    angular.element('.notificationCheckbox').attr('checked',false);
    allChecker.toggleClass('fa-square-o');
    allChecker.toggleClass('fa-check-square-o');
    
  };

  $scope.starClickToggle =function ($event,notificationId,isImportant) {
      $event.preventDefault();
      //detect type
      var element= angular.element($event.target);
      // $event.target.children(0);
      var glyph = element.hasClass("glyphicon");
      var fa = element.hasClass("fa");

      //Switch states
      if (glyph) {
        element.toggleClass("glyphicon-star");
        element.toggleClass("glyphicon-star-empty");
      }

      if (fa) {
        element.toggleClass("fa-star");
        element.toggleClass("fa-star-o");
      }
      //deleteNotification.delete(notificationId);
      if(isImportant){
        markNotificationAsUnImportant.put(notificationId);
      }
      else{
        markNotificationAsImportant.put(notificationId);
      }
    };
  $scope.showimportant=function(){
    getImportantNotifications.get().then(function(response){
      $scope.notifications=response.data;
    })
  }

  $scope.deleteNotifications=function(){
    var idList=angular.element('.notificationCheckbox:checked').map(function() {
    return this.value;
    }).get();
    angular.element('.notificationCheckbox:checked').parent().parent().hide();
    deleteNotification.delete(idList.join(','));
  }
  $scope.timeConvert=function(inputdate){
    var datecurrent=new Date($.now());
    var date= new Date(inputdate);
    var seconds= (datecurrent-date)/1000;
    var outtime=''
    if(seconds<60)
        outtime='vài giây trước';
    else if(seconds<3600)
        outtime= Math.round(seconds/60) + ' phút trước';
    else if(seconds<86400)
        outtime= Math.round(seconds/3600)+ ' giờ trước';
    else if(seconds<86400*6)
        outtime=Math.round(seconds/86400)+' ngày trước';
    else
        outtime=date.toISOString().slice(0,10);
    return outtime;
  }
});


App.factory('getNotification',function($http,$localStorage){
  return{
    get:function(ID){
      return $http({
        method:'GET',
        url:originPath+'/api/v1/notifications/get-by-id',      /////// lost
        params:{
          token:$localStorage.access_token,
          notificationId:ID
        }
      }).then(function(response){
        return response.data;
      },function(response){
        //////////// fail
      });
    }
  };
})

App.factory('markAsRead',function($http,$localStorage){
    return{
    put:function(ID){
      return $http({
        method:'PUT',
        url:originPath+'/api/v1/notifications/mark-one-as-read',      /////// lost
        data:{
          token:$localStorage.access_token,
          notificationId :ID
        }
      }).then(function(response){
        return response.data;
      },function(response){
        //////////// fail
      });
    }
  };
})
App.controller('notification',function($scope,$rootScope,getNotification,$routeParams,markAsRead){
  // console.log($routeParams.id);
  var request=getNotification.get($routeParams.id);
  request.then(function(res){
    $rootScope.notification=res.data;
  });
  markAsRead.put($routeParams.id);
});

App.controller('courserequest',function($scope){

});
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
    $scope.labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    
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
  function subjectCredit(subjectJsonData){
    result={}
    for (i=0;i<subjectJsonData.length;i++){
      result[subjectJsonData[i].code]=subjectJsonData[i].details.credits;
    }
    //console.log(result[0]);
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
  function GPASemesterList(records,credits){
    result=[];
    for(var key in records) {
      result.push(semesterGPA(records[key],credits));
    }
    //result=[3.4,3.2,3.3]
    // console.log(result);
    result=[result];
    // console.log(result);
    return result;
  }
  function semesterGPA(records,credits){
    var totalCredits=0.0;
    var totalScore4=0.0;
    var credit=0;
    var score=0.0;
    for(i=0;i<records.length;i++){
      var score=records[i].score4;
      var subjectCode=records[i].subjectCode;
      if( subjectCode in credits && score !==0){                       //if subjectCode exist
        credit=credits[records[i].subjectCode];
        totalCredits+= credit;
        totalScore4+=score*credit;
      }
    }
    var result=totalScore4/totalCredits;
    return Number(Math.round(result+'e2')+'e-2');
    // return 0;
  }
  function listSemester(records){
    var keys = []
    for(var key in records) keys.push( key );
    //console.log(keys);
    return keys;
  }

  function ABCDPieChartData(records,credits){
    var rattingDistinct=[];
    var ratingCount=[];
    var numberRattingType=0;
    var subjectCode;
    var charRatting;
    for(var key in records){
      for(i=0;i<records[key].length;i++){
        charRatting=records[key][i].scoreChar;
        subjectCode=records[key][i].subjectCode;
        if(subjectCode in credits && charRatting!='F'){
          if(rattingDistinct.indexOf(records[key][i].scoreChar)>-1){
              ratingCount[numberRattingType-1]+=credits[subjectCode];
          }
          else{
            rattingDistinct.push(records[key][i].scoreChar);
            ratingCount.push(credits[subjectCode]);
            numberRattingType++;
          }
        }
      }
    } 
    return[rattingDistinct,ratingCount];
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
