angular.module('home')
.controller('logInController', ['$scope', '$http', '$location', '$cookies', ($scope, $http, $location, $cookies) => {
	$scope.enterError = false;
	$scope.authError = false;
	$scope.clickLogin = () => {
		if ($scope.username === undefined || $scope.password === undefined) {
			$scope.enterError = true;
			return;
		} else {
			$scope.enterError = false;
		}
		$http({
			url: '/auth/',
			method: 'POST',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: {
				username: $scope.username,
				password: $scope.password
			}
		}).then(function success(res) {
			if (res.data === 'True') {
				var d = new Date();
				$cookies.put('auth', d);
				$location.url('/member');
			} else {
				$scope.authError = true;
			}
		}, function error(res) {
		});
	};
}])
.directive('login', () => {
	return {
		restrict: 'E',
		controller: 'logInController',
		templateUrl: 'static/html/login.html'
	};
});