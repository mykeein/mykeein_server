'use strict';

angular.module('mykeein', ['mykeein.filters', 'mykeein.services', 'mykeein.directives', 'mykeein.controllers', 'ngClipboard']).
config(['ngClipProvider', '$routeProvider', '$locationProvider', function(ngClipProvider, $routeProvider,$locationProvider) {
	$routeProvider
	.when('/', {templateUrl: 'partials/main.html', controller: 'mykeein.controllers.main'})
	.when('/:email', {templateUrl: 'partials/user.html', controller: 'mykeein.controllers.user'})
	.otherwise({redirectTo: '/'});
	ngClipProvider.setPath("/lib/ZeroClipboard.swf");
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');
}]);