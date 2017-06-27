angular.module('home')
.directive('member', () => {
	return {
		restrict: 'E',
		templateUrl: 'static/html/member.html'
	};
});