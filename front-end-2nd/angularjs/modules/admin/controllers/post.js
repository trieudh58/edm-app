
/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */

angularBolt.controller('PostController', ['NgTableParams','$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function (NgTableParams,$location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.formData = {};
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    // Modal
    $scope.groups = [{value: 1, label: 'Group 1'}, {value: 2, label: 'Group 2'}, {value: 3, label: 'Group 3'}, {value: 4, label: 'Group 4'}];
    rest.path ='/admin/student-groups/get-all';
    rest.get().then(function boltSuccess(response){

        if (response.data.success == true) {
            $scope.groups=studentGroupConvert(response.data.data);
        }
        else {
            apiError(response);
        }
        }, function boltError(response) {
            apiError(response);
    });

    $scope.notifications= [];
    $scope.getAllNotifications = function(){
        rest.path = 'admin/notifications/get-all';
        rest.get().then(function boltSuccess(response) {
            if (response.data.success == true) {
                $scope.notifications=response.data.data;
                $scope.tableNotification = new NgTableParams({}, {
                    dataset: $scope.notifications
                });
            }
            else {
                apiError(response);
            }
            }, function boltError(response) {
                apiError(response);
            });
    }
    $scope.getAllNotifications();

    $scope.deleteNotification = function(id,index){
        rest.path = 'admin/notifications/delete-by-id';
        rest.deleteModel({'notificationId': id}).then(function boltSuccess(response) {
            if (response.data.success == true) {
                $scope.notifications.splice(index,1);
                $scope.tableNotification = new NgTableParams({},{
                    dataset: $scope.notifications
                })
                toastr.warning('Các mục đã chọn đã được xóa thành công', 'Thông báo');
            }
            else {
                apiError(response);
            }
            }, function boltError(response) {
                apiError(response);
            });
        }

    $scope.createNotification = function(data){
        data.targetGroupIds = data.targetGroupIds.join(',');
        rest.path = 'admin/notifications/create';
        rest.postModel(data).then(function boltSuccess(response) {
            if (response.data.success == true) {
                toastr.success('Thông báo đã tạo', 'Thông báo');
            }
            else {
                apiError(response);
            }
            }, function boltError(response) {
                apiError(response);
            });
    }

    $scope.createAndSendNotification = function(data){
        data.targetGroupIds = data.targetGroupIds.join(',');
        rest.path = 'admin/notifications/create-and-send';
        rest.postModel(data).then(function boltSuccess(response) {
            if (response.data.success == true) {
                toastr.success('Thông báo đã gửi', 'Thông báo');
            }
            else {
                apiError(response);
            }
            }, function boltError(response) {
                apiError(response);
            });
    }

    $scope.sendNotification = function(id,index){
        rest.path = 'admin/notifications/send-created';
        rest.putModel({'notificationId': id}).then(function boltSuccess(response) {
            if (response.data.success == true) {
                $scope.notifications[index].isSent= true;
                $scope.tableNotification = new NgTableParams({},{
                    dataset: $scope.notifications
                })
                toastr.success('đã gửi', 'Thông báo');
            }
            else {
                apiError(response);
            }
            }, function boltError(response) {
                apiError(response);
            });
        }

    $scope.getAllSentNotifications = function(){
        rest.path = 'admin/notifications/get-all-sent';
        rest.get().then(function boltSuccess(response) {
            if (response.data.success == true) {
                $scope.notifications=response.data.data;
                $scope.tableNotification = new NgTableParams({}, {
                    dataset: $scope.notifications
                });
            }
            else {
                apiError(response);
            }
            }, function boltError(response) {
                apiError(response);
            });
    }
    $scope.getUnSentNotifications = function(){
        rest.path = 'admin/notifications/get-all-unsent';
        rest.get().then(function boltSuccess(response) {
            if (response.data.success == true) {
                $scope.notifications=response.data.data;
                $scope.tableNotification = new NgTableParams({}, {
                    dataset: $scope.notifications
                });
            }
            else {
                apiError(response);
            }
            }, function boltError(response) {
                apiError(response);
            });
    }

    $scope.passNotificationData = function(id){
        rest.path = 'admin/notifications/get-one-by-id';
        rest.getWithParams({'notificationId': id}).then(function boltSuccess(response) {
            if (response.data.success == true) {
                $scope.notificationDetail=response.data.data;
            }
            else {
                apiError(response);
            }
            }, function boltError(response) {
                apiError(response);
            });
    }
}]);
