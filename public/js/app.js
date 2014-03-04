'use strict';

angular.module('keiin', ['keiin.filters', 'keiin.services', 'keiin.directives', 'keiin.controllers', 'ngClipboard']).
config(['ngClipProvider', '$routeProvider', '$locationProvider', function(ngClipProvider, $routeProvider,$locationProvider) {
	$routeProvider
	.when('/', {templateUrl: 'partials/main.html', controller: 'keiin.controllers.main'})
	.when('/:email', {templateUrl: 'partials/user.html', controller: 'keiin.controllers.user'})
	.when('/approve/:approveId', {templateUrl: 'partials/approve.html', controller: 'keiin.controllers.approve'})
	.otherwise({redirectTo: '/'});
	ngClipProvider.setPath("/lib/ZeroClipboard.swf");
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');
}]);