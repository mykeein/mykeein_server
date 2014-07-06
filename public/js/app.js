'use strict';

angular.module('mykeein', ['ngCookies', 'mykeein.filters', 'mykeein.services', 'mykeein.directives', 'mykeein.controllers', 'ngClipboard', 'pascalprecht.translate']).
config(['ngClipProvider', '$routeProvider', '$locationProvider', '$translateProvider', function(ngClipProvider, $routeProvider,$locationProvider, $translateProvider) {
	$routeProvider
	.when('/', {templateUrl: 'partials/main.html', controller: 'mykeein.controllers.main'})
	.when('/:email', {templateUrl: 'partials/user.html', controller: 'mykeein.controllers.user'})
	.otherwise({redirectTo: '/'});
	ngClipProvider.setPath("/lib/ZeroClipboard.swf");
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');
	$translateProvider.translations('en', {
		UNLOCK: 'Unlock',
		REQUEST: 'Request',
		BUTTON_TEXT_EN: 'English',
		BUTTON_TEXT_RU: 'Russian'
	})
	.translations('ru', {
		UNLOCK: 'Отпереть',
		REQUEST: 'Запрос',
		BUTTON_TEXT_EN: 'Английский',
		BUTTON_TEXT_RU: 'Русский'
	});
	$translateProvider.preferredLanguage('en');
	$translateProvider.useCookieStorage();
}]);

//https://www.youtube.com/watch?v=9CWifOK_Wi8&noredirect=1
//http://www.ng-newsletter.com/posts/angular-translate.html