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

directives.directive('ngEnter', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.which === 13) {
				scope.$apply(function (){
					scope.$eval(attrs.ngEnter);
				});
				event.preventDefault();
			}
		});
	};
});

directives.directive('selectAll', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.on('click', function () {
				this.select();
			});
		}
	};
});

directives.directive('clipClear', ['$window', function ($window) {
	return {
		scope: {
			clipClear: '&',
			clipClick: '&'
		},
		restrict: 'A',
		link: function (scope, element, attrs) {
        // Create the clip object
        var clip1 = new ZeroClipboard(element);
        clip1.on( 'load', function(client) {
        	var onMousedown1 = function (event) {
        		console.log('clear');
        		event.setText("");
        		if (angular.isDefined(attrs.clipClick)) {
        			scope.$apply(scope.clipClick);
        		}
        	};
        	client.on('mousedown', onMousedown1);

        	scope.$on('$destroy', function() {
        		client.off('mousedown', onMousedown1);
        		client.unclip(element);
        	});
        });
    }
};
}]);

directives.directive('clipCopy', ['$window', function ($window) {
	return {
		scope: {
			clipCopy: '&',
			clipClick: '&'
		},
		restrict: 'A',
		link: function (scope, element, attrs) {
        // Create the clip object
        var clip2 = new ZeroClipboard(element);
        clip2.on( 'load', function(client) {
        	var onMousedown2 = function (event) {
        		console.log('copy');
        		event.setText(scope.$eval(scope.clipCopy));
        		if (angular.isDefined(attrs.clipClick)) {
        			scope.$apply(scope.clipClick);
            }// setTimeout(function() { console.log("clipboard clean"); event.setText('timeout'); }, 15000);
        };
        client.on('mousedown', onMousedown2);

        scope.$on('$destroy', function() {
        	client.off('mousedown', onMousedown2);
        	client.unclip(element);
        });
    });
    }
};
}]);