

angularBolt.controller('QuestionServeyController', ['$location', '$localStorage', '$scope', '$rootScope', 'rest', 'toastr', '$window', 'cfpLoadingBar', function ($location, $localStorage, $scope, $rootScope, rest, toastr, $window, cfpLoadingBar) {

	// Initial
	$rootScope.nosb = true;
	$scope.formData = {};
	$scope.editformData = {};
	if ($window.boltLoading) $window.boltLoading.finish();
	$scope.$on('$viewContentLoaded', function () {
		boltScript();
	});
	rest.path = '/student-survey/get-student-survey-question-list';
	rest.get().then(function boltSuccess(response) {

		if (response.data.success == true) {
			$scope.dataQuestions = response.data.questions;
		} else {

			// Response error
			apiError(response);
		}

	}, function boltError(response) {

		// Response error
		apiError(response);

	});

	$scope.deleteQuestion = function (id) {
		rest.path = '/admin/student-survey/delete-question';
		rest.deleteModel({'questionId': id}).then(function boltSuccess(response) {
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

	$scope.postNewQuestion = function (newformData) {

		rest.path = '/admin/student-survey/create-student-survey-question';
		rest.postModel(newformData).then(function boltSuccess(response) {

			if (response.data.success == true) {

				//toastr.success(response.data.message, 'Thông báo!');
				toastr.success('Thông tin đã được gửi đi thành công', 'Thông báo!');
				$scope.newformData = {};

			} else {

				//toastr.warning(response.data.message, 'Thông báo!');
				toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
			}

		}, function boltError(response) {

			// Response error
			apiError(response);

		});

	}
	$scope.setCurrentData = function (id, question, questionType, choices) {
		$scope.editformData.id = id;
		$scope.editformData.question = question;
		$scope.editformData.questionType = questionType;
		$scope.editformData.choices = choices;
	}
	$scope.putNewQuestion = function (editformData) {

		rest.path = 'admin/student-survey/update-student-survey-question';

		rest.putModel(editformData).then(function boltSuccess(response) {

			if (response.data.success == true) {

				//toastr.success(response.data.message, 'Thông báo!');
				toastr.success('Thông tin đã được gửi đi thành công', 'Thông báo!');
				$scope.editformData = {};

			} else {

				//toastr.warning(response.data.message, 'Thông báo!');
				toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
			}

		}, function boltError(response) {

			// Response error
			apiError(response);

		});

	}
	function getquestionTypes() {
		var result = [
			{'value': 'textBox', 'label': 'Text Box'},
			{'value': 'checkboxes', 'label': 'Check Boxes'},
			{'value': 'time', 'label': 'Time'},
			{'value': 'date', 'label': 'Date'},
			{'value': 'multipleChoices', 'label': 'Multiple Choices'},
		];
		return result;
	}

	rest.path = '/admin/student-survey/get-question-type';
	rest.get().then(function boltSuccess(response) {

		if (response.data.success == true) {


			//toastr.success(response.data.message, 'Thông báo!');
			$scope.questionTypes = getquestionTypes();
		} else {

			//toastr.warning(response.data.message, 'Thông báo!');
			toastr.warning('Đã có lỗi xảy ra', 'Thông báo!');
		}

	}, function boltError(response) {

		// Response error
		apiError(response);

	});
}
]);
