

angularBolt.controller('FeedbackController', ['$location', '$localStorage', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', function ($location, $localStorage, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

	// Initial
	$rootScope.nosb = true;
	$scope.formData = {};
	$scope.editformData = {};
	if ($window.boltLoading) $window.boltLoading.finish();
	$scope.$on('$viewContentLoaded', function () {
		boltScript();
	});
	rest.path = '/admin/feedbacks/read-all';
	rest.get().then(function boltSuccess(response) {

		if (response.data.success == true) {
			$scope.feedbacks = response.data.data;
		} else {

			// Response error
			apiError(response);
		}

	}, function boltError(response) {

		// Response error
		apiError(response);

	});

	$scope.deleteFeedback = function (id) {
		rest.path = '/admin/feedbacks/delete-one-by-id';
		rest.deleteModel({'feedbackId': id}).then(function boltSuccess(response) {
			if (response.data.success) {
				toastr.success('DELETED', 'Thông báo!');
			}
			else {
				toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
			}
		}, function boltError(response) {
			apiError(response);
		});
	};

}
]);
