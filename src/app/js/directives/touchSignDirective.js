angular
  .module('digitalreception.directives')
  .directive('touchSign', ['$timeout', function($timeout) {
    'use strict';
    return {
      template: '<svg id="svg1" xmlns="http://www.w3.org/2000/svg" version="1.1" width="300" height="300" style="position: absolute; left: 100px; top: 100px; stroke: #0AA5C3; fill: rgba(0,0,0,0); stroke-width: 6px; opacity: 1.0" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<polygon class="hex" points="300,150 225,280 75,280 0,150 75,20 225,20">         </polygon>' +
      '</svg>' +
      '<svg id="svg2" xmlns="http://www.w3.org/2000/svg" version="1.1" width="300" height="300" style="position: absolute; left: 100px; top: 100px; stroke: #0AA5C3; fill: rgba(0,0,0,0); stroke-width: 6px; opacity: 0" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<polygon class="hex" points="300,150 225,280 75,280 0,150 75,20 225,20">         </polygon>' +
      '</svg>' +
      '<svg id="svg3" xmlns="http://www.w3.org/2000/svg" version="1.1" width="300" height="300" style="position: absolute; left: 100px; top: 100px; stroke: #0AA5C3; fill: rgba(0,0,0,0); stroke-width: 6px; opacity: 0" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<polygon class="hex" points="300,150 225,280 75,280 0,150 75,20 225,20">         </polygon>' +
      '</svg>' +
      '<svg id="svg4" xmlns="http://www.w3.org/2000/svg" version="1.1" width="300" height="300" style="position: absolute; left: 100px; top: 100px; stroke: #0AA5C3; fill: rgba(0,0,0,0); stroke-width: 6px; opacity: 0" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<polygon class="hex" points="300,150 225,280 75,280 0,150 75,20 225,20">         </polygon>' +
    '</svg>',
      transclude: true,
      link: function(scope, element, attrs) {
        var timer1 = $timeout(function() { animateSvg($('#svg4')); }, 3000);
        var timer2 = $timeout(function() { animateSvg($('#svg3')); }, 2000);
        var timer3 = $timeout(function() { animateSvg($('#svg2')); }, 1000);
        animateSvg($('#svg1'));
        function animateSvg(svg)
        {
            svg.css('transform','scale(0.2,0.2)').css('opacity',1);
            svg.animate({ transform : 'scale(1.5)' , opacity: 0 }, { duration: 4000, complete: function() { animateSvg(svg); } });
        }

        scope.$on('destroy', function() {
          $timeout.cancel(timer1);
          $timeout.cancel(timer2);
          $timeout.cancel(timer3);
        });

      }
    };
  }]);
