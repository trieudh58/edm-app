/*
 <!--************************************************************-->
 <!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
 <!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
 <!--************************************************************-->
 */

angularBolt.controller('AssessmentQuestionController', ['$location','$localStorage','$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar',function ($location,$localStorage,$scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

    // Initial
    $rootScope.nosb = true;
    $scope.formData = {};
    $scope.system_formData= {};
    $scope.addToOtherSectionModel = {'nextSection' : null};
    $scope.sectionId = 1;
    $scope.questionId = null;
    $scope.questionContent = null;
    $scope.sectionName = null;
    if($window.boltLoading)$window.boltLoading.finish();
    $scope.$on('$viewContentLoaded', function () {
        boltScript();
    });


    $scope.getAll = function () {
        rest.path='admin/assessment-question/get-list-course-class-assessment-set';
        rest.get().then(function boltSuccess(response){
            if(response.data.success) {
                var getCourseSetList=[];
                var sectionList = response.data.data;
                for(index in sectionList){
                    rest.path = 'admin/assessment-question/get-assessment-set-by-id?questionSetId='+sectionList[index]._id;
                    rest.get().then(function boltSuccess(response) {
                        if (response.data.success) {
                            console.log(response.data.data);
                            getCourseSetList.push(response.data.data);
                        }
                        else {
                            apiError(response);
                        }
                    }, function boltError(response) {
                        apiError(response);
                    });

                    console.log(getCourseSetList);
                }
                $scope.courseSetList= getCourseSetList;
                $scope.setSectionsNameid(sectionList);
            }
            else{
                apiError(response);
            }
        },function boltError(response){
            apiError(response);
        });
    };
    $scope.getAll();

    $scope.getAllSystem = function () {
        rest.path='admin/assessment-question/get-list-system-assessment-set';
        rest.get().then(function boltSuccess(response){
            if(response.data.success) {
                var getCourseSetList=[];
                var system_sectionList = response.data.data;
                for(index in system_sectionList){
                    rest.path = 'admin/assessment-question/get-assessment-set-by-id?questionSetId='+system_sectionList[index]._id;
                    rest.get().then(function boltSuccess(response) {
                        if (response.data.success) {
                            console.log(response.data.data);
                            getCourseSetList.push(response.data.data);
                        }
                        else {
                            apiError(response);
                        }
                    }, function boltError(response) {
                        apiError(response);
                    });

                    console.log(getCourseSetList);
                }
                $scope.systemSetList= getCourseSetList;
                $scope.system_setSectionsNameid(system_sectionList);
            }
            else{
                apiError(response);
            }
        },function boltError(response){
            apiError(response);
        });
    };
    $scope.getAllSystem();



    /*SET OPERATION*/
    $scope.setSection = function(id,name){
        console.log("set section")
        $scope.sectionId = id;
        $scope.sectionName = name;
    };

    $scope.setSectionsNameid = function (sections) {
        $scope.sectionsNameId = convertSectionNameIdArray(sections);
    };

    $scope.system_setSectionsNameid = function (sections) {
        $scope.system_sectionsNameId = convertSectionNameIdArray(sections);
    };

    $scope.setCurrentQuestion = function (questionId, quesContent) {
        $scope.questionId = questionId;
        $scope.newQuestion = quesContent;
    };

    /*QUESTION API*/
    $scope.deleteQuestion = function (id) {
        rest.path = 'admin/assessment-question/delete-question';
        rest.deleteModel({'questionId':id}).then(function boltSuccess(response) {
            if (response.data.success) {
                console.log("success");
                toastr.success('DELETED', 'Thông báo!');
                $scope.getAll();
                $scope.getAllSystem();
            }
            else {console.log("error");
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }
        }, function boltError(response) {
            apiError(response);
        });
    };

    $scope.addToOtherSection = function () {
        rest.path = 'admin/assessment-question/add-questions-to-question-set';
        console.log($scope.questionId)
        console.log($scope.addToOtherSectionModel.nextSection);
        rest.postModel({'questionIdList':$scope.questionId, 'questionSetId':$scope.addToOtherSectionModel.nextSection}).then(function boltSuccess(response) {
            if (response.data.success) {
                // $scope.addToOtherSectionModel.nextSection = null;
                toastr.success('Đã thêm thành công !', 'Thông báo!');
                $scope.getAll();
                $scope.getAllSystem();
            }
            else {console.log("error");
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }
        }, function boltError(response) {
            apiError(response);
        });
    };

    $scope.editQuestion = function (questionId,newQuestion){
        var formData = {
            'id' : questionId,
            'content' : newQuestion
        };
        rest.path = 'admin/assessment-question/update-question';
        rest.putModel(formData).then(function boltSuccess(response) {

            if (response.data.success == true) {

                //toastr.success(response.data.message, 'Thông báo!');
                toastr.success('Thông tin đã được gửi đi thành công', 'Thông báo!');
                $scope.newQuestion = null;
                $scope.getAll();
                $scope.getAllSystem();

            }else {

                //toastr.warning(response.data.message, 'Thông báo!');
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }
        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    };

    $scope.createQuestion = function (sectionId,body) {
        var formData = {
            'questionSetId' : sectionId,
            'content' : body
        };

        rest.path = 'admin/assessment-question/create-question';
        rest.postModel(formData).then(function boltSuccess(response) {

            if (response.data.success == true) {

                //toastr.success(response.data.message, 'Thông báo!');
                toastr.success('Thông tin đã được gửi đi thành công', 'Thông báo!');
                $scope.body = null;
                $scope.getAll();
                $scope.getAllSystem();

            }else {

                //toastr.warning(response.data.message, 'Thông báo!');
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }
        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    };

    /*SECTION API*/
    $scope.createSection = function (newSectionName) {
        var formData = {
            'name' : newSectionName
        };

        rest.path = 'admin/assessment-question/create-course-class-question-set';
        rest.postModel(formData).then(function boltSuccess(response) {

            if (response.data.success == true) {

                //toastr.success(response.data.message, 'Thông báo!');
                toastr.success('Thông tin đã được gửi đi thành công', 'Thông báo!');
                $scope.newSectionName = null;
                $scope.getAll();

            }else {

                //toastr.warning(response.data.message, 'Thông báo!');
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }
        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    };

    $scope.activeSection = function (id) {
        rest.path = 'admin/assessment-question/active-assessment-question-set';
        rest.putModel({'questionSetId':id}).then(function boltSuccess(response) {
            if (response.data.success) {
                console.log("success");
                toastr.success('DELETED', 'Thông báo!');
                $scope.getAll();
                $scope.getAllSystem();

            }
            else {console.log("error");
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }
        }, function boltError(response) {
            apiError(response);
        });
    };

    $scope.deleteSection = function (id) {
        rest.path = 'admin/assessment-question/delete-question-set';
        rest.deleteModel({'questionSetId':id}).then(function boltSuccess(response) {
            if (response.data.success) {
                console.log("success");
                toastr.success('DELETED', 'Thông báo!');
                $scope.getAll();
            }
            else {console.log("error");
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }
        }, function boltError(response) {
            apiError(response);
        });
    };


    /* SYSTEM - SECTION API*/
    $scope.system_createSection = function (newSectionName) {
        var formData = {
            'name' : newSectionName
        };

        rest.path = 'admin/assessment-question/create-system-question-set';
        rest.postModel(formData).then(function boltSuccess(response) {

            if (response.data.success == true) {

                //toastr.success(response.data.message, 'Thông báo!');
                toastr.success('Thông tin đã được gửi đi thành công', 'Thông báo!');
                $scope.newSectionName = null;
                $scope.getAll();
                $scope.getAllSystem();
            }else {

                //toastr.warning(response.data.message, 'Thông báo!');
                toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
            }
        }, function boltError(response) {

            // Response error
            apiError(response);

        });
    };

}]);