angular.module('home')
.directive('main', () => {
	return {
		restrict: 'E',
		templateUrl: 'static/html/main.html'
	};
});