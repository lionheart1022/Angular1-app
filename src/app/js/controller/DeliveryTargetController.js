angular
  .module('digitalreception.controllers')
  .controller('DeliveryTargetController', ['$scope', '$state', '$translate', '$translatePartialLoader', 
    function ($scope, $state, $translate, $translatePartialLoader) {
    'use strict';
    $translatePartialLoader.addPart('main');
    $translate.refresh();

    // Method list
    $scope.specifictPerson = {}; // notify specific person
    $scope.notifyTeam = {};      // Notify team

    /* Navigation Part */
    $scope.specifictPerson = function() {
      $state.go('list', {source: 'delivery'});
    };

    $scope.notifyTeam = function() {
      // Notify Team, but it is empty yet
      $state.go('notifying', {employee: {FullName: 'Decos Team'}, reason: 'delivery'});
    };

  }]);
