angular
  .module('digitalreception.controllers')
  .controller('WelcomeController', ['$scope', '$state', '$window', '$translate', '$translatePartialLoader',
    function ($scope, $state, $window, $translate, $translatePartialLoader) {
    'use strict';
    $translatePartialLoader.addPart('main');
    $translate.refresh();

    $scope.currentLanguage = $translate.use();

    /* Navigation Part */
    $scope.getStarted = function() {
      $state.go('start');
    };

    $scope.changeLanguage = function() {
      $scope.currentLanguage = ($scope.currentLanguage === 'en_US') ? 'nl_NL' : 'en_US';
      $translate.use($scope.currentLanguage);
    };

  }]);
