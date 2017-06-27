angular.module('home')
.controller('signupController', ($scope, $http, $location) => {
	$scope.emptyError = false;
	$scope.usernameError = false;
	$scope.emailError = false;
	$scope.validError = false;
	$scope.clickSignup = () => {
		if ($scope.name === undefined || $scope.email === undefined || $scope.username === undefined || $scope.password === undefined) {
			$scope.emptyError = true;
			return;
		} else {
			$scope.emptyError = false;
		}
		$http({
			url: '/check/valid/',
			method: 'POST',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/x-www-form-urlencoded'
		  },
			data: {email: $scope.email}
		}).then(function success(res) {
			if (res.data === 'valid') {
				$scope.register();
			}
		}, function error(res) {
			$scope.validError = true;
		});
	};
	$scope.register = () => {
		$http({
			url: '/register/',
			method: 'POST',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/x-www-form-urlencoded'
		  },
			data: {
				name: $scope.name,
				email: $scope.email,
				username: $scope.username,
				password: $scope.password,
			}
		}).then(function success(res) {
			if (res.data === 'done') {
				$location.url('/login');
			}
		}, function error(res) {
			if (res.data === 'email taken') {
        $scope.usernameError = false;
        $scope.emailError = true;
			} else if (res.data === 'username taken') {
				$scope.emailError = false;
				$scope.usernameError = true;
			}
		});
	}
})
.directive('signup', () => {
	return {
		restrict: 'E',
		controller: 'signupController',
		templateUrl: 'static/html/signup.html'
	};
});