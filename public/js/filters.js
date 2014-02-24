'use strict';

/* Filters */

angular.module('keiin.filters', []).
filter('interpolate', ['version', function(version) {
	return function(text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	};
}]);
