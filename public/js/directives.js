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

directives.directive('clipCopy', function () {
	return {
		scope: {
			clipCopy: '&',
			myValue: '=myData',
			clipClick: '&'
		},
		restrict: 'A',
		link: function (scope, element, attrs) {
	        // Create the clip object
	        var clip = new ZeroClipboard(element);
	        clip.on( 'load', function(client) {
	        	var onMousedown = function (event) {
	        		console.log('copy');
	        		event.setText(scope.$eval(scope.clipCopy));
	        		setTimeout(function() {
	        			console.log("auto clean");
	        			event.setText("");
	        			scope.myValue.ansContent = "";
	        			scope.$apply();
	        		}, 15000);
	        		if (angular.isDefined(attrs.clipClick)) {
	        			scope.$apply(scope.clipClick);
	        		}
	        	};
	        	client.on('mousedown', onMousedown);
	        	scope.$on('$destroy', function() {
	        		client.off('mousedown', onMousedown);
	        		client.unclip(element);
	        	});
	        });
	    }
	};
});


directives.directive('clipClean', function() {
	return {
		scope: {
			clipClean: '&',
			myValue: '=myData',
			clipClick: '&'
		},
		restrict: 'A',
		link: function(scope, element, attr) {
			var clip = new ZeroClipboard(element);
			clip.on( 'load', function(client) {
				var onMousedown = function (event) {
					console.log('clean');
					event.setText("");
					scope.myValue.ansContent = "";
					scope.$apply();
				};
				client.on('mousedown', onMousedown);
				scope.$on('$destroy', function() {
					client.off('mousedown', onMousedown);
					client.unclip(element);
				});
			});
		}
	}
});