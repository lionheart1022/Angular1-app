angular
  .module('digitalreception.directives')
  .directive('slidebox', ['$timeout', function slideboxDirective ($timeout) {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch('employeeList', function() {
                $timeout(function() {
                    $(element).smoothDivScroll({
                        hotSpotScrolling: false,
                        touchScrolling: true,
                        moreFetch: scope.moreFetch,
                        startAtElementId: "employee" + (scope.currentPage * scope.itemsPerPage - 5)
                    });
                });
            });
        }
    };
}]);
