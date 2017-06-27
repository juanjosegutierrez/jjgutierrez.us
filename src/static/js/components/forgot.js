angular.module('home')
.controller('forgotController', ($scope, $http, $location, UserService) => {
	$scope.blankError = false;
	$scope.emailError = false;
	$scope.clickSend = () => {
		if ($scope.email === undefined) {
			$scope.blankError = true;
			return;
		} else {
			$scope.blankError = false;
			$http({
				url: '/check/db/',
				method: 'POST',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: {
					email: $scope.email
				}
			}).then(function success(res) {
		    if (res.data === 'found') {
			    UserService.email = $scope.email;
	        $location.url('/recover');
		    }
			}, function error(res) {
				$scope.emailError = true;
			});
		}
	};
})
.directive('forgot', () => {
	return {
		restrict: 'E',
		controller: 'forgotController',
		templateUrl: 'static/html/forgot.html'
	};
});