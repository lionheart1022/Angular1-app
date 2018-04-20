angular
  .module('digitalreception.controllers')
  .controller('SignUpController', ['$scope', '$state', '$translate', '$translatePartialLoader', 'GuestInfoService', 'focus', 'CloseKeyboard',
    function ($scope, $state, $translate, $translatePartialLoader, GuestInfoService, focus, CloseKeyboard) {
    'use strict';
    $translatePartialLoader.addPart('main');
    $translate.refresh();
    $scope.usernameRequired = false;
    $scope.keyboardVisible = false;

    $scope.user = {
      name: GuestInfoService.name,
      company: GuestInfoService.company
    };

    $scope.signUp = function () {
      CloseKeyboard();
      // First validation, do we have name input?
      $scope.usernameRequired = false;
      if ($scope.user && $scope.user.name && ($scope.user.name !== undefined) && ($scope.user.name.length >0) ) {
        var record = angular.copy($scope.user);
        GuestInfoService.data.name = record.name;
        GuestInfoService.data.company = record.company;
        $state.go('list', {source: 'meet'});
      } else {
        // Doesn't have at leat name inputted? Ask user to deal with it.
        $scope.usernameRequired = true;
      }

    };

    $scope.moveFocusToCompany = function() {
      focus('company');
    };

    $scope.openKeyboard = function() {
      $scope.keyboardVisible = true;
      $scope.$apply();
    };
    $scope.hideKeyboard = function() {
      $scope.keyboardVisible = false;
      $scope.$apply();
    };

  }]);
