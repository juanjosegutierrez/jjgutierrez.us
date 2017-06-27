var app = angular.module('home', ['ngRoute', 'ngCookies']);
app.config(($routeProvider, $httpProvider) => {
	$httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
	$routeProvider
	.when('/', {
		template: '<main></main>',
		authenticated: false
	})
	.when('/member', {
		template: '<member></member>',
		authenticated: true
	})
	.when('/login', {
		template: '<login></login>',
		authenticated: false
	})
	.when('/logout', {
		template: '<login></login>',
		authenticated: false
	})
	.when('/signup', {
		template: '<signup></signup>',
		authenticated: false
	})
	.when('/fibonacci', {
		template: '<fibonacci></fibonacci>',
		authenticated: false
	})
	.when('/forgot', {
		template: '<forgot></forgot>',
		authenticated: false
	})
	.when('/recover', {
		template: '<recover></recover>',
		authenticated: false
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.run(['$rootScope', '$location', '$cookies', ($rootScope, $location, $cookies) => {
  $rootScope.$on('$routeChangeStart', (event, next, current) => {
    if (next.$$route.authenticated) {
    	var d = new Date();
    	if ($cookies.get('auth') === undefined || d - new Date($cookies.get('auth')) > 300000) {
    		$location.path('/login');
    	}
    }
    if (next.$$route.originalPath === '/login' || next.$$route.originalPath === '/signup') {
    	var d1 = new Date();
    	if ($cookies.get('auth') !== undefined && d1 - new Date($cookies.get('auth')) < 300000) {
    		$location.path(current.$$route.originalPath);
    	}
    }
    if (next.$$route.originalPath === '/logout') {
    	$cookies.remove('auth');
    }
  });
}]);