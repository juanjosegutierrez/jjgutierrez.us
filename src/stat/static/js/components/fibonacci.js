angular.module('home')
.controller('fibController', ($scope, $http) => {
	$scope.showError = false;
	$scope.result = '';
	$scope.clickCalc = () => {
		if (isNaN(Number($scope.inputNumber)) === true 
			|| Number($scope.inputNumber) < 0 
			|| Number($scope.inputNumber) > 100
			|| Number($scope.inputNumber) % 1 !== 0) {
			$scope.showError = true;
			$scope.result = '';
			return;
		} else {
			$scope.showError = false;
		}
		$http({
			url: '/calculate/',
			method: 'GET',
			headers: {'X-Requested-With': 'XMLHttpRequest'},
			params: {input: $scope.inputNumber}
		}).then(function success(res) {
			$scope.result = res.data.number;
		}, function error(res) {
		});
	};
})
.directive('fibonacci', () => {
	return {
		restrict: 'E',
		controller: 'fibController',
		templateUrl: 'static/html/fibonacci.html'
	};
});