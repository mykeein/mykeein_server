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
	        var eventCopy;
	        var clip = new ZeroClipboard(element);
	        clip.on( 'load', function(client) {
	        	var onMousedown = function (event) {
	        		console.log('copy');
	        		eventCopy = event;
	        		event.setText(scope.$eval(scope.clipCopy));
	        		if (angular.isDefined(attrs.clipClick)) {
	        			scope.$apply(scope.clipClick);
	        		}
	        	};
	        	var clean = function(event){
	        		setTimeout(function() {
	        			scope.myValue.countToClean = scope.myValue.countToClean - 1;
	        			if(scope.myValue.countToClean<1){
	        				console.log("auto clean");
	        				scope.myValue.countToClean = "";
	        				if(eventCopy){
	        					eventCopy.setText("");
	        				}
	        				scope.myValue.ansContent = "";
	        			}else{clean();}
	        			scope.$apply();
	        		}, 1000);
	        	};
	        	scope.myValue.countToClean = 15;
	        	clean();
	        	client.on('mousedown', onMousedown);
	        	scope.$on('$destroy', function() {
	        		client.off('mousedown', onMousedown);
	        		client.unclip(element);
	        	});
	        });
}};});


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
					scope.myValue.countToClean = 0;
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