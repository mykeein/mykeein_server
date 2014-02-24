'use strict';

angular.module('keiin', ['keiin.filters', 'keiin.services', 'keiin.directives', 'keiin.controllers', 'ngClipboard']).
config(['ngClipProvider', '$routeProvider', function(ngClipProvider, $routeProvider) {
	$routeProvider
	.when('/main', {templateUrl: 'partials/main.html', controller: 'keiin.controllers.main'})
	.when('/main/:username', {templateUrl: 'partials/user.html', controller: 'keiin.controllers.user'})
	.otherwise({redirectTo: '/main'});
	ngClipProvider.setPath("/lib/ZeroClipboard.swf");
}]);