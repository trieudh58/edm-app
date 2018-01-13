<!--************************************************************-->
<!-- Developed by Lightning Bolt Solutions - http://tiaset.net  -->
<!-- giaphv@tiaset.net,  rocket@tiaset.net,  hoangdv@tiaset.net -->
<!--************************************************************-->
<!DOCTYPE html>
<html ng-app="angularBolt">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <base href="/"/>
    <meta charset="utf-8">
    <meta name="fragment" content="bolt"/>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Lightning Bolt Solutions</title>
    <!--begin library css-->
    <link rel="stylesheet" type="text/css" href="assets/angular/angular/angular-csp.css">
    <link rel="stylesheet" type="text/css" href="assets/angular/angular-motion/dist/angular-motion.min.css">
    <link rel="stylesheet" type="text/css" href="assets/angular/angular-toastr/dist/angular-toastr.min.css">
    <link rel="stylesheet" type="text/css" href="assets/angular/angular-bootstrap/ui-bootstrap-csp.css">
    <link rel="stylesheet" type="text/css" href="assets/angular/angular-form-for/dist/form-for.css">
    <!--end library css-->
    <!--begin bolt css-->
    <link rel="stylesheet" type="text/css" href="assets/css/bolt.min.css">
    <link rel="stylesheet" type="text/css" href="assets/css/bolt.custom.css">
    <!--end bolt css-->
    <!--begin library script-->
    <script type="text/javascript" src="assets/angular/angular/angular.min.js"></script>
    <script type="text/javascript" src="assets/angular/angular-route/angular-route.min.js"></script>
    <script type="text/javascript" src="assets/angular/angular-sanitize/angular-sanitize.js"></script>
    <script type="text/javascript" src="assets/angular/angular-animate/angular-animate.min.js"></script>
    <script type="text/javascript" src="assets/angular/angular-strap/dist/angular-strap.js"></script>
    <script type="text/javascript" src="assets/angular/angular-strap/dist/angular-strap.tpl.min.js"></script>
    <script type="text/javascript" src="assets/angular/angular-bootstrap/ui-bootstrap.min.js"></script>
    <script type="text/javascript" src="assets/angular/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
    <script type="text/javascript" src="assets/angular/ngstorage/ngstorage.min.js"></script>
    <script type="text/javascript" src="assets/angular/angular-form-for/dist/form-for.min.js"></script>
    <script type="text/javascript" src="assets/angular/angular-form-for/dist/form-for.bootstrap-templates.js"></script>
    <script type="text/javascript" src="assets/angular/chart.js/dist/chart.min.js"></script>
    <script type="text/javascript" src="assets/angular/angular-chart.js/dist/angular-chart.min.js"></script>
    <!--end library script-->
    <!--begin angular script-->
    <script type="text/javascript" src="bolt/angular/bolt.app.js"></script>
    <script type="text/javascript" src="bolt/angular/bolt.config.js"></script>
    <script type="text/javascript" src="bolt/angular/bolt.route.js"></script>
    <script type="text/javascript" src="bolt/angular/bolt.run.js"></script>
    <script type="text/javascript" src="bolt/angular/bolt.factory.js"></script>
    <script type="text/javascript" src="bolt/angular/bolt.service.js"></script>
    <script type="text/javascript" src="bolt/angular/bolt.directive.js"></script>
    <?php
    /*
     * Get all controller
     * by bolt@tiaset.net
     */
    $controllers = array();
    $files = array();
    $modules = glob('modules/*');
    $i = 0;

    foreach ($modules as $module) {
        $controllers = glob($module);

        foreach ($controllers as $controller) {
            $files = glob($controller . '/controllers/*.js');

            foreach ($files as $key => $file) {
                $i++;
                echo ($i > 1) ? "\t" : "";
                echo '<script type="text/javascript" src="' . $file . '"></script>' . "\n";

            }
        }
    }
    ?>
    <!--end angular script-->
    <!--begin bolt script-->
    <script type="text/javascript" src="assets/js/bolt.min.js"></script>
    <script type="text/javascript" src="assets/js/bolt.custom.js"></script>
    <!--end bolt script-->
</head>
<body ng-class="{'navbar-top-md-md' : access != true, 'page-access' : access == true }">
<div ng-include="'bolt/layout/navbar.html'" ng-hide="access" class="navbar-fixed-top"></div>
<!--begin page container-->
<div class="page-container" ng-class="{'login-container' : access == true}">
    <!--begin page content-->
    <div class="page-content">
        <!--begin main content-->
        <div class="content-wrapper">
            <!--begin ng view-->
            <div class="row">
                <div class="view-animate-container" ng-class="{'col-sm-9' : access != true  && nosb != true}">
                    <div ng-view></div>
                </div>
                <div ng-include="'bolt/layout/sidebar.html'" ng-hide="access||nosb" ng-class="{'col-sm-3' : access != true && nosb != true}"></div>
            </div>
            <toaster-container></toaster-container>
            <!--end ng view-->
        </div>
        <!--end main content-->
    </div>
    <!--end page content-->
    <!--begin footer-->
    <div class="footer text-muted">
        <p ng-if="access == true" ng-class="text-center">&copy; <?php echo date('Y'); ?> PRE. Designed by <a href="http://tiaset.net" target="_blank">TiaSet™</a></p>
        <div ng-if="access != true">
            <div class="clearfix pull-left">
                <div class="breadcrumb-line-wide">
                    <ul class="breadcrumb" ng-if="isAdmin != true">
                        <li>
                            <a href="/student/dashboard">Tổng quan</a>
                        </li>
                        <li>
                            <a href="/student/infomation">Thông tin sinh viên</a>
                        </li>
                        <li>
                            <a href="/student/recommendation">Tư vấn học tập</a>
                        </li>
                        <li>
                            <a href="/student/suggestion">Gợi ý NCKH và KLTN</a>
                        </li>
                        <li>
                            <a href="/student/utility">Dành cho sinh viên</a>
                        </li>
                        <li>
                            <a href="/student/school">Thông tin từ nhà trường</a>
                        </li>
                        <li>
                            <a href="/student/infomation/profile">Hồ sơ cá nhân</a>
                        </li>
                        <li>
                            <a href="/logout">Đăng xuất</a>
                        </li>
                    </ul>
                </div>
                <hr>
                <p>&copy; <?php echo date('Y'); ?> PRE. Vietnam National Unversity, 144 Xuân Thủy - Cầu Giấy - Hà Nội <br> Tel: <a href="tel:84.4.37547.461">84.4.37547.461</a>, Email: <a href="mailto:uet@vnu.edu.vn">uet@vnu.edu.vn</a></p>
            </div>
        </div>
    </div>
    <!--end footer-->
</div>
<!--end: page container-->
</body>
</html>
