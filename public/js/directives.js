'use strict';

/* Directives */


var directives = angular.module('mykeein.directives', []);

directives.directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}]);

directives.directive('appName', ['name', function(name) {
	return function(scope, elm, attrs) {
		elm.text(name);
	};
}]);

directives.directive('appDomain', ['domain', function(name) {
	return function(scope, elm, attrs) {
		elm.text(name);
	};
}]);