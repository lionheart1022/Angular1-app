angular
  .module('digitalreception.directives')
  .directive('hasKeyboard', function() {
  return {
     link: function(scope, element) {
      scope.$watch('keyboardVisible', function(value){
      	if (value) {
        	element.addClass('focused');
        } else {
          element.removeClass('focused');
        }
      });
    }
  };
});