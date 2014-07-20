'use strict';

var app = angular.module('mykeein', 
	[
	'ngCookies', 
	'mykeein.filters', 
	'mykeein.services', 
	'mykeein.directives', 
	'mykeein.controllers', 
	'pascalprecht.translate'
	]);

app.run(['$document', function($document) {
	ZeroClipboard.config({
		moviePath: '//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/1.3.2/ZeroClipboard.swf',
		trustedDomains: ["*"],
		allowScriptAccess: "always",
		forceHandCursor: true
	});
}]);

app.config(
	[
	'$routeProvider', 
	'$locationProvider', 
	'$translateProvider', 
	function($routeProvider,$locationProvider, $translateProvider) {
		$routeProvider.when('/', { 
			templateUrl: 'partials/main.html', 
			controller: 'mykeein.controllers.main'
		});
		$routeProvider.when('/:email', { 
			templateUrl: 'partials/user.html', 
			controller: 'mykeein.controllers.user'
		});
		$routeProvider.otherwise({
			redirectTo: '/'
		});
		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');
		$translateProvider.translations('en', {
			UNLOCK: 'Unlock',
			REQUEST: 'Request',
			BUTTON_TEXT_EN: 'English',
			BUTTON_TEXT_RU: 'Russian',
			EMAIL_HINT: 'email',
			MASTER_KEY: 'Master Key:',
			COPY: 'Copy',
			CLEAR_CLIPBOARD: 'Clear Clipboard',
			WAITING_FOR: 'Awaiting for ',
			YOU_BLOCKED: 'You have been blocked by ',
			WARNING: 'Warning message from ',
			NOT_EXISTS: 'does not exist',
			NOT_REGISTERED: 'was not approved yet'
		});
		$translateProvider.translations('ru', {
			UNLOCK: 'Отпереть',
			REQUEST: 'Запрос',
			BUTTON_TEXT_EN: 'Английский',
			BUTTON_TEXT_RU: 'Русский',
			EMAIL_HINT: 'адрес э-почты',
			MASTER_KEY: 'Мастер Ключ:',
			COPY: 'Копировать',
			CLEAR_CLIPBOARD: 'Очистить буфер обмена',
			WAITING_FOR: 'В ожидании ',
			YOU_BLOCKED: 'Вы были заблокированы пользователем',
			WARNING: 'Предупреждение сообщение от',
			NOT_EXISTS: 'не существует',
			NOT_REGISTERED: 'еще не утвержден'
		});
		$translateProvider.preferredLanguage('en');
		$translateProvider.useCookieStorage();
	}]);