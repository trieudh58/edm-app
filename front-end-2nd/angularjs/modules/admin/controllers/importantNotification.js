

angularBolt.controller('ImportantNotificationController', ['NgTableParams','$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function (NgTableParams,$location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.formData = {};
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

    $scope.notifications= [];
    $scope.getAllNotifications = function(){
        rest.path = 'admin/important-notification/get-all';
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
        rest.path = 'admin/important-notification/delete';
        rest.deleteModel({'postId': id}).then(function boltSuccess(response) {
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
        rest.path = 'admin/important-notification/create';
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
        rest.path = 'admin/important-notification/create-and-publish';
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
        rest.path = 'admin/important-notification/publish-one';
        rest.putModel({'postId': id}).then(function boltSuccess(response) {
            if (response.data.success == true) {
                $scope.notifications[index].isPublished= true;
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
        rest.path = 'admin/important-notification/get-all-published';
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
        rest.path = 'admin/important-notification/get-all-unpublished';
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
        $scope.notificationDetail=$scope.notifications.filter( obj => obj._id === id)[0];
    }
}]);
