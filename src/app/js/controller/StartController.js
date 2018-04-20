angular
  .module('digitalreception.controllers')
  .controller('StartController', ['$scope', '$state', '$window', '$translate', '$translatePartialLoader', 'GuestInfoService',
    function ($scope, $state, $window, $translate, $translatePartialLoader, GuestInfoService ) {
    'use strict';
    $translatePartialLoader.addPart('main');
    $translate.refresh();

    $scope.currentLanguage = $translate.use();

    /* Navigation Part */  
    $scope.moveToAppointment = function() {
      GuestInfoService.data = {name:null, company: null};
      $state.go('signup');
    };

    $scope.moveToDelivery = function() {
      $state.go('delivery-target');
    };

    $scope.notifyTeam = function() {
      // Notify Team, but it is empty yet
      $state.go('notifying', {employee: {FullName: 'Decos Team'}});
    };

    $scope.changeLanguage = function() {
      $scope.currentLanguage = ($scope.currentLanguage === 'en_US') ? 'nl_NL' : 'en_US';
      $translate.use($scope.currentLanguage);
    };

  }]);