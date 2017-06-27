angular.module('home')
.controller('recoverController', ($scope, $http, $location, UserService) => {
	$scope.entryError = false;
	$scope.codeError = false;
	$scope.random = Math.floor(Math.random() * 1000) + 1071;
	$http({
		url: '/email/',
		method: 'POST',
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: {
			code: $scope.random.toString(),
			email: UserService.email
		}
	}).then(function success(res) {
    return;
	}, function error(res) {	
	});
	$scope.clickSet = () => {
		if ($scope.security === undefined || $scope.password === undefined) {
			$scope.entryError = true;
			return;
		} else if (Number($scope.security) !== $scope.random) {
			$scope.entryError = false;
			$scope.codeError = true;
			return;
		} else {
			$http({
				url: '/update/',
				method: 'POST',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: {
					email: UserService.email,
					password: $scope.password
				}
			}).then(function success(res) {
	      if (res.data === 'changed') {
          $location.url('/login')
	      }
			}, function error(res) {
			});
		}
	};
})
.directive('recover', () => {
	return {
		restrict: 'E',
		controller: 'recoverController',
		templateUrl: 'static/html/recover.html'
	};
});