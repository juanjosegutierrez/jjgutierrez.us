angular.module('home')
.controller('navController', ($scope, $location, $cookies) => {
  $scope.loggedIn = false;
  $scope.loggedOut = false;
  var d = new Date();
	if ($cookies.get('auth') !== undefined && d - new Date($cookies.get('auth')) < 300000) {
		$scope.loggedIn = true;
	} else {
		$scope.loggedOut = true;
	}
	$scope.clickLogo = () => {
		$location.url('/');
	};
	$scope.clickLoginLink = () => {
		$location.url('/login');
	};
	$scope.clickLogoutLink = () => {
		$location.url('/logout');
	};
	$scope.clickFibonacciLink = () => {
		$location.url('/fibonacci');
	};
	$scope.clickMemberLink = () => {
		$location.url('/member');
	};
})
.directive('navbar', () => {
	return {
		restrict: 'E',
		controller: 'navController',
		templateUrl: 'static/html/navbar.html'
	};
});