
angularBolt.run(function ($templateCache) {
    $templateCache.put('ng-table/pager.html', '<div class="ng-cloak ng-table-pager" ng-if="params.total() > params.count()"> <div ng-if="params.settings().counts.length" class="ng-table-counts btn-group pull-right"> <button ng-repeat="count in params.settings().counts" type="button" ng-class="{\'active\':params.count()==count}" ng-click="params.count(count)" class="btn btn-default"> <span ng-bind="count"></span> </button> </div> <ul class="pagination ng-table-pagination"> <li ng-class="{\'disabled\': !page.active && !page.current, \'active\': page.current}" ng-repeat="page in pages" ng-switch="page.type"> <a ng-switch-when="prev" ng-click="params.page(page.number)" href="">&laquo;</a> <a ng-switch-when="first" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="page" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="more" ng-click="params.page(page.number)" href="">&#8230;</a> <a ng-switch-when="last" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="next" ng-click="params.page(page.number)" href="">&raquo;</a> </li> </ul> </div> ');
});

angularBolt.run(['NgTableParams', '$localStorage', '$http', '$window', '$location', '$rootScope', '$route', 'cfpLoadingBar', 'rest', 'toastr', function (NgTableParams, $localStorage, $http, $window, $location, $rootScope, $route, cfpLoadingBar, rest, toastr) {

    // Call function
    setInterval(function () {
        $rootScope.reloadNotification();
    }, 60000);
    setInterval(function () {
        $rootScope.refreshToken1();
    }, 1200000);

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        $rootScope.reloadNotification();
        $rootScope.personalInfo.profilePicture = $localStorage.profilePicture;
        if ($location.path() != '/logout') $rootScope.refreshToken2();
    });

    $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
        $rootScope.reloadNotification();
    });


    // Declare function
    $rootScope.reloadNotification = function () {

        rest.path = 'notifications/get-5-latest-titles';
        rest.get().then(function boltSuccess(response) {

            if (response.data.success == true) {
                $rootScope.latestNotifications = response.data.data.latest;
                $rootScope.unreadNotifications = response.data.data.unread;

            }

        }, function boltError(response) {

            // Response error
            console.log(response);
            if (response.data.message == 'TokenExpiredError') $location.path('/logout');

        });

    }

    // Declare function
    $rootScope.getAllNotification = function () {

        rest.path = 'notifications/get-titles';
        rest.get().then(function boltSuccess(response) {

            if (response.data.success == true) {

                $rootScope.tableParamsNotification = new NgTableParams({}, {
                    dataset: convertNotificationArray(response.data.data)
                });


            } else {

                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    }

    // Declare function
    $rootScope.getUnreadTitles = function () {

        rest.path = 'notifications/get-unread-titles';
        rest.get().then(function boltSuccess(response) {

            if (response.data.success == true) {

                $rootScope.tableParamsNotification = new NgTableParams({}, {
                    dataset: convertNotificationArray(response.data.data)
                });

            } else {

                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    }

    // Declare function
    $rootScope.getImportantTitles = function () {

        rest.path = 'notifications/get-important-titles';
        rest.get().then(function boltSuccess(response) {

            if (response.data.success == true) {

                $rootScope.tableParamsNotification = new NgTableParams({}, {
                    dataset: convertNotificationArray(response.data.data)
                });

            } else {

                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    }

    // Declare function
    $rootScope.markAsImportant = function (id) {

        rest.path = 'notifications/mark-one-as-important';
        rest.putModel({'notificationId': id}).then(function boltSuccess(response) {

            if (response.data.success == true) {
                $rootScope.reloadNotification();
                $rootScope.getAllNotification();
                toastr.success('Mục này đã được đánh dấu là quan trọng', 'Thông báo');

            } else {

                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    }

    // Declare function
    $rootScope.markAsUnimportant = function (id) {

        rest.path = 'notifications/mark-one-as-unimportant';
        rest.putModel({'notificationId': id}).then(function boltSuccess(response) {

            if (response.data.success == true) {
                $rootScope.reloadNotification();
                $rootScope.getAllNotification();
                toastr.warning('Mục này đã bỏ đánh dấu là quan trọng', 'Thông báo');

            } else {

                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    }

    // Declare function
    $rootScope.markAsRead = function (id) {

        rest.path = 'notifications/mark-one-as-read';
        rest.putModel({'notificationId': id}).then(function boltSuccess(response) {

            if (response.data.success == true) {
                $rootScope.reloadNotification();
                $rootScope.getAllNotification();
                toastr.success('Mục này đã được dánh dấu là đã đọc', 'Thông báo');

            } else {

                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    }

    // Declare function
    $rootScope.markAsUnread = function (id) {

        rest.path = 'notifications/mark-one-as-unread';
        rest.putModel({'notificationId': id}).then(function boltSuccess(response) {

            if (response.data.success == true) {
                $rootScope.reloadNotification();
                $rootScope.getAllNotification();
                toastr.warning('Mục này đã bỏ dánh dấu là đã đọc', 'Thông báo');

            } else {

                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    }

    // Declare function
    $rootScope.markAllAsRead = function (id) {

        rest.path = 'notifications/mark-all-as-read';
        rest.putModel().then(function boltSuccess(response) {

            if (response.data.success == true) {
                $rootScope.reloadNotification();
                $rootScope.getAllNotification();
                toastr.success('Tất cả các mục đã được dánh dấu là đã đọc', 'Thông báo');

            } else {

                // Response error
                apiError(response);
            }

        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    }

    // Declare function
    $rootScope.refreshToken1 = function () {

        $http.get(rest.baseUrl + 'tokens/refresh', {headers: {'Authorization': 'Bearer ' + $localStorage.refreshToken}}).then(function (response) {
            if (response.data.success == true) {

                $localStorage.accessToken = response.data.accessToken;
                $localStorage.refreshToken = response.data.refreshToken;
                $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.accessToken;


            } else {
                // Response error
                apiError(response);
            }
        });

    }

    // Declare function
    $rootScope.refreshToken2 = function () {

        $http.get(rest.baseUrl + 'tokens/refresh', {headers: {'Authorization': 'Bearer ' + $localStorage.refreshToken}}).then(function (response) {
            if (response.data.success == true) {

                $localStorage.accessToken = response.data.accessToken;
                $localStorage.refreshToken = response.data.refreshToken;
                $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.accessToken;

                // Get account
                rest.path = 'users/get';
                rest.get().then(function boltSuccess(response) {

                        // Response success
                        $localStorage.isActive = response.data.data.isActive;
                        $localStorage.isAdmin = response.data.data.isAdmin;
                        $localStorage.fullName = response.data.data.personalInfo.fullName;
                        $localStorage.email = response.data.data.email;
                        $rootScope.isActive = response.data.data.isActive;
                        $rootScope.isAdmin = response.data.data.isAdmin;
                        $rootScope.personalInfo.fullName = response.data.data.personalInfo.fullName ? response.data.data.personalInfo.fullName : 'Noname';
                        $rootScope.personalInfo.profilePicture = response.data.data.personalInfo.profilePicture ? response.data.data.personalInfo.profilePicture : 'assets/images/placeholder.jpg';
                        $rootScope.access = false;
                        $localStorage.profilePicture = $rootScope.personalInfo.profilePicture;

                    }, function boltError(response) {

                        // Response error
                        loginError(response);

                    }
                );


            } else {
                // Response error
                apiError(response);
            }
        });

    }

}]);
