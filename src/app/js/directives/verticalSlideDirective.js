angular
  .module('digitalreception.directives')
  .directive('verticalSlide', function() {
    'use strict';
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var unitHeight = 100;
        var $ul = $(element).find('ul');
        // Toggle class based on the child container height
        scope.$watch('messages', function() {
          if ($ul.height() > $(element).height()) {
            $(element).addClass('overflow');
            scope.overflowed = true;
          } else {
            $(element).removeClass('overflow');
            scope.overflowed = false;
          }
        }, true);

        // Swipe up and down event handler
        scope.$watch('offsetY', function() {
          if (scope.overflowed) {
            if (($ul.height() - scope.offsetY * unitHeight) >$(element).height()) {
              
              if (scope.offsetY < 0) {
                scope.offsetY = 0;
                scope.invalidScrollDown = true;
                scope.invalidScrollUp = false;
              } else {
                $ul.css('bottom', 0-scope.offsetY * 100);
                scope.invalidScrollUp = false;
              }

            } else {
              $ul.css('bottom', $(element).height() - $ul.height() - 10);
              scope.invalidScrollUp = true;
              scope.invalidScrollDown = false;
            }
          }
        });

      }
    };
  });
