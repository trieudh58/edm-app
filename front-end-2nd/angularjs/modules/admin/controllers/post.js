
angularBolt.controller('PostController', ['NgTableParams','$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function (NgTableParams,$location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.formData = {};
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });

     $scope.notifications= [];
    $scope.getAllPosts = function(){
        rest.path = 'admin/posts/get-all';
        rest.get().then(function boltSuccess(response) {
            if (response.data.success == true) {
                $scope.Posts=response.data.data;
                $scope.tablePost = new NgTableParams({}, {
                    dataset: $scope.Posts
                });
            }
            else {
                apiError(response);
            }
            }, function boltError(response) {
                apiError(response);
            });
    }
    $scope.getAllPosts();

    $scope.deletePost = function(id,index){
        rest.path = 'admin/posts/delete';
        rest.deleteModel({'postId': id}).then(function boltSuccess(response) {
            if (response.data.success == true) {
                $scope.Posts.splice(index,1);
                $scope.tablePost = new NgTableParams({},{
                    dataset: $scope.Posts
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

    $scope.createPost = function(data){
        var formData = new FormData();
        formData.append('coverImage',  $scope.postCover)
        $scope.postCover ={};
        formData.append('header', data.header);
        formData.append('body', data.body);
        rest.path = 'admin/posts/create';
        rest.postFile(formData).then(function boltSuccess(response) {
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

    $scope.createAndSendPost = function(data){
        var formData = new FormData();
        formData.append('coverImage',  $scope.postCover)
        $scope.postCover ={};
        formData.append('header', data.header);
        formData.append('body', data.body);
        rest.path = 'admin/posts/create-and-publish';
        rest.postFile(formData).then(function boltSuccess(response) {
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

    $scope.sendPost = function(id,index){
        rest.path = 'admin/posts/publish-one';
        rest.putModel({'postId': id}).then(function boltSuccess(response) {
            if (response.data.success == true) {
                $scope.Posts[index].isPublished= true;
                $scope.tablePost = new NgTableParams({},{
                    dataset: $scope.Posts
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

    $scope.getAllSentPosts = function(){
        rest.path = 'admin/posts/get-all-published';
        rest.get().then(function boltSuccess(response) {
            if (response.data.success == true) {
                $scope.Posts=response.data.data;
                $scope.tablePost = new NgTableParams({}, {
                    dataset: $scope.Posts
                });
            }
            else {
                apiError(response);
            }
            }, function boltError(response) {
                apiError(response);
            });
    }
    $scope.getUnSentPosts = function(){
        rest.path = 'admin/posts/get-all-unpublished';
        rest.get().then(function boltSuccess(response) {
            if (response.data.success == true) {
                $scope.Posts=response.data.data;
                $scope.tablePost = new NgTableParams({}, {
                    dataset: $scope.Posts
                });
            }
            else {
                apiError(response);
            }
            }, function boltError(response) {
                apiError(response);
            });
    }

    $scope.passPostData = function(id){
        $scope.PostDetail=$scope.Posts.filter( obj => obj._id === id)[0];
    }
    $scope.uploadFile = function(files){
        $scope.postCover = files[0];
        console.log("dm");
        console.log(files[0]);
        console.log($scope.postCover.name);
    }
}]);
