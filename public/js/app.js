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
		BUTTON_TEXT_RU: 'Russian',
		EMAIL_HINT: 'email',
		MASTER_KEY: 'Master Key:',
		COPY: 'Copy',
		CLEAR_CLIPBOARD: 'Clear Clipboard',
		WAITING_FOR: 'Waiting for ',
		APPROVE_EXPIRED: 'Approve: expired. resend approve from mykee.in app again.',
		APPROVE_SUCCESS: 'Approve: success ! Thank you using mykee.in',
		YOU_BLOCKED: 'You have been blocked by',
		WARNING: 'Warning message from',
		NOT_EXISTS: 'not exist',
		NOT_REGISTERED: 'not approved yet'
	})
	.translations('ru', {
		UNLOCK: 'Отпереть',
		REQUEST: 'Запрос',
		BUTTON_TEXT_EN: 'Английский',
		BUTTON_TEXT_RU: 'Русский',
		EMAIL_HINT: 'адрес э-почты',
		MASTER_KEY: 'Мастер Ключ:',
		COPY: 'Копировать',
		CLEAR_CLIPBOARD: 'Очистить буфер обмена',
		WAITING_FOR: 'В ожидании ',
		APPROVE_EXPIRED: 'Линк утверждения устарел. пришлите заново утверждение , из настроек аппликации.',
		APPROVE_SUCCESS: 'Ваш электронный адрес успешно подтвержден ! Спасибо что выбрали mykee.in',
		YOU_BLOCKED: 'Вы были заблокированы пользователем',
		WARNING: 'Предупреждение сообщение от',
		NOT_EXISTS: 'не существует',
		NOT_REGISTERED: 'еще не утвержден'
	});
	$translateProvider.preferredLanguage('en');
	$translateProvider.useCookieStorage();
}]);

//https://www.youtube.com/watch?v=9CWifOK_Wi8&noredirect=1
//http://www.ng-newsletter.com/posts/angular-translate.html