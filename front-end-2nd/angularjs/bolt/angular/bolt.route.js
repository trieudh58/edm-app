
angularBolt.config(['$routeProvider', function ($routeProvider) {

    $routeProvider

        // .when('/', {
        //     redirectTo: '/index.html'
        // })
        .when('/', {
            title: 'Trang chủ',
            templateUrl: 'index.html', 
            controller: ['$location', function($location){
                window.location = '/index.html';
            }]
        })

        .when('/access', {
            title: 'Truy cập hệ thống',
            templateUrl: 'modules/site/views/access.html',
            controller: 'SiteAccessController',
        })

        .when('/component', {
            title: 'Các thành phần',
            templateUrl: 'modules/site/views/component.html',
            controller: 'SiteComponentController',
        })

        .when('/logout', {
            title: 'Đăng xuất khỏi hệ thống',
            template: '',
            controller: 'SiteLogoutController',
        })

        // Admin

        .when('/admin/dashboard', {
            title: 'Tổng quan',
            templateUrl: 'modules/admin/views/dashboard.html',
            controller: 'AdminDashboardController'
        })

        .when('/admin/account', {
            title: 'Quản lý tài khoản',
            templateUrl: 'modules/admin/views/account.html',
            controller: 'AdminAccountController'
        })

        .when('/admin/notification', {
            title: 'Quản lý thông báo',
            templateUrl: 'modules/admin/views/notification.html',
            controller: 'AdminNotificationController'
        })

        .when('/admin/data', {
            title: 'Quản lý dữ liệu',
            templateUrl: 'modules/admin/views/data.html',
            controller: 'AdminDataController'
        })

        .when('/admin/setting', {
            title: 'Thiết lập',
            templateUrl: 'modules/admin/views/setting.html',
            controller: 'AdminSettingController'
        })

        .when('/admin/statistic', {
            title: 'Thống kê',
            templateUrl: 'modules/admin/views/statistic.html',
            controller: 'AdminStatisticController'
        })

        .when('/admin/profile', {
            title: 'Hồ sơ cá nhân',
            templateUrl: 'modules/admin/views/profile.html',
            controller: 'AdminProfileController'
        })

        .when('/admin/question-servey',{
            title:'Quản lý student servey',
            templateUrl: 'modules/admin/views/questionSurvey.html',
            controller: 'QuestionServeyController'
        })

        .when('/admin/course-request',{
            title:'Yêu cầu mở lớp',
            templateUrl: 'modules/admin/views/courseRequest.html',
            controller: 'CourseRequestController'
        })
        .when('/admin/assessment-question',{
            title:'Quản lý câu hỏi đánh giá',
            templateUrl: 'modules/admin/views/assessmentQuestion.html',
            controller: 'AssessmentQuestionController'
        })
        .when('/admin/feedback',{
            title:'Feedback',
            templateUrl: 'modules/admin/views/feedback.html',
            controller: 'FeedbackController'
        })
        .when('/admin/post',{
            title:'Feedback',
            templateUrl: 'modules/admin/views/post.html',
            controller: 'PostController'
        })
        .when('/admin/important-notification',{
            title:'Feedback',
            templateUrl: 'modules/admin/views/importantNotification.html',
            controller: 'ImportantNotificationController'
        })
        // Student

        .when('/student/dashboard', {
            title: 'Tổng quan',
            templateUrl: 'modules/student/views/dashboard.html',
            controller: 'StudentDashboardController'
        })

        .when('/student/notification', {
            title: 'Thông báo',
            templateUrl: 'modules/student/views/notification.index.html',
            controller: 'StudentNotificationIndexController'
        })

        .when('/student/notification/:id', {
            title: 'Thông báo',
            templateUrl: 'modules/student/views/notification.detail.html',
            controller: 'StudentNotificationDetailController'
        })

        .when('/student/infomation', {
            title: 'Thông tin sinh viên',
            templateUrl: 'modules/student/views/infomation.index.html',
            controller: 'StudentInfomationIndexController'
        })

        .when('/student/infomation/survey', {
            title: 'Khảo sát sinh viên',
            templateUrl: 'modules/student/views/infomation.survey.html',
            controller: 'StudentInfomationSurveyController'
        })

        .when('/student/infomation/profile', {
            title: 'Hồ sơ cá nhân',
            templateUrl: 'modules/student/views/infomation.profile.html',
            controller: 'StudentInfomationProfileController'
        })

        .when('/student/infomation/score', {
            title: 'Kết quả học tập',
            templateUrl: 'modules/student/views/infomation.score.html',
            controller: 'StudentInfomationScoreController'
        })

        .when('/student/recommendation', {
            title: 'Tư vấn học tập',
            templateUrl: 'modules/student/views/recommendation.index.html',
            controller: 'StudentRecommendationIndexController'
        })

        .when('/student/recommendation/study', {
            title: 'Tư vấn học tập',
            templateUrl: 'modules/student/views/recommendation.study.html',
            controller: 'StudentRecommendationStudyController'
        })

        .when('/student/recommendation/timetable', {
            title: 'Tạo thời khóa biểu',
            templateUrl: 'modules/student/views/recommendation.timetable.html',
            controller: 'StudentRecommendationTimetableController'
        })

        .when('/student/recommendation/subject', {
            title: 'Gợi ý môn học kỳ tới',
            templateUrl: 'modules/student/views/recommendation.subject.html',
            controller: 'StudentRecommendationSubjectController'
        })

        .when('/student/recommendation/score', {
            title: 'Dự báo kết quả học tập',
            templateUrl: 'modules/student/views/recommendation.score.html',
            controller: 'StudentRecommendationScoreController'
        })

        .when('/student/suggestion', {
            title: 'Gợi ý NCKH và KLTN',
            templateUrl: 'modules/student/views/suggestion.index.html',
            controller: 'StudentSuggestionIndexController'
        })
        .when('/student/suggestion/lecturerinfo', {
            title: 'Thông tin giảng viên hướng dẫn',
            templateUrl: 'modules/student/views/suggesstion.lecturerinfo.html',
            controller: 'StudentSuggestionLecturerInfoController'
        })

        .when('/student/suggestion/srd', {
            title: 'Gợi ý nghiên cứu khoa học',
            templateUrl: 'modules/student/views/suggestion.srd.html',
            controller: 'StudentSuggestionSrdController'
        })

        .when('/student/suggestion/thesis', {
            title: 'Gợi ý khóa luận tốt nghiệp',
            templateUrl: 'modules/student/views/suggestion.thesis.html',
            controller: 'StudentSuggestionThesisController'
        })

        .when('/student/utility', {
            title: 'Dành cho sinh viên',
            templateUrl: 'modules/student/views/utility.index.html',
            controller: 'StudentUtilityIndexController'
        })

        .when('/student/utility/request', {
            title: 'Xin mở lớp',
            templateUrl: 'modules/student/views/utility.request.html',
            controller: 'StudentUtilityRequestController'
        })

        .when('/student/utility/comment', {
            title: 'Bình luận đánh giá môn học',
            templateUrl: 'modules/student/views/utility.comment.html',
            controller: 'StudentUtilityCommentController'
        })

        .when('/student/utility/assessment', {
            title: 'Đánh giá môn đã học',
            templateUrl: 'modules/student/views/utility.assessment.html',
            controller: 'StudentUtilityAssessmentController'
        })

        .when('/student/utility/feedback', {
            title: 'Góp ý và đánh giá hệ thống',
            templateUrl: 'modules/student/views/utility.feedback.html',
            controller: 'StudentUtilityFeedbackController'
        })

        .when('/student/school', {
            title: 'Thông tin từ nhà trường',
            templateUrl: 'modules/student/views/school.index.html',
            controller: 'StudentSchoolIndexController'
        })

        .when('/student/school/news', {
            title: 'Giới thiệu nhà trường',
            templateUrl: 'modules/student/views/school.news.html',
            controller: 'StudentSchoolNewsController'
        })

        .when('/student/school/notice', {
            title: 'Thông báo quan trọng',
            templateUrl: 'modules/student/views/school.notice.html',
            controller: 'StudentSchoolNoticeController'
        })

        .when('/student/school/eps', {
            title: 'Chương trình đào tạo',
            templateUrl: 'modules/student/views/school.eps.html',
            controller: 'StudentSchoolEpsController'
        })

        .when('/student/school/timetable', {
            title: 'Thời khóa biểu',
            templateUrl: 'modules/student/views/school.timetable.html',
            controller: 'StudentSchoolTimetableController'
        })


        // Error

        .when('/bolt-error', {
            title: 'Đã có lỗi xảy ra',
            templateUrl: 'bolt/layout/error.html'
        })

        .otherwise({
            redirectTo: '/bolt-error'
        });

}]);