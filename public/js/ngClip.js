/*jslint node: true */
/*global ZeroClipboard */
'use strict';

angular.module('ngClipboard', []).
provider('ngClip', function() {
  var self = this;
  this.path = '//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/1.3.2/ZeroClipboard.swf';
  return {
    setPath: function(newPath) {
     self.path = newPath;
   },
   $get: function() {
    return {
      path: self.path
    };
  }
};
}).
run(['$document', 'ngClip', function($document, ngClip) {
  ZeroClipboard.config({
    moviePath: ngClip.path,
    trustedDomains: ["*"],
    allowScriptAccess: "always",
    forceHandCursor: true
  });
}]).
directive('clipCopy', ['$window', 'ngClip', function ($window, ngClip) {
  return {
    scope: {
      clipCopy: '&',
      clipClick: '&'
    },
    restrict: 'A',
    link: function (scope, element, attrs) {
        // Create the clip object
        var clip = new ZeroClipboard(element);
        clip.on( 'load', function(client) {
          var onMousedown = function (client) {
            console.log("clipboard click[scope.clipCopy:"+scope.clipCopy+", attrs.clipClick"+attrs.clipClick+", scope.clipClick"+scope.clipClick);
            client.setText(scope.$eval(scope.clipCopy));
            if (angular.isDefined(attrs.clipClick)) {
              scope.$apply(scope.clipClick);
            }
            setTimeout(function() { 
              console.log("clipboard clean");
              window.clipboardData.setData('text','');
            }, 15000);
          };
          client.on('mousedown', onMousedown);

          scope.$on('$destroy', function() {
            client.off('mousedown', onMousedown);
            client.unclip(element);
          });
        });
      }
    };
  }]);
