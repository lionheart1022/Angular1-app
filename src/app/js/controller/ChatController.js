angular
  .module('digitalreception.controllers')
  .controller('ChatController', ['$scope', '$state', '$stateParams', '$timeout', '$translatePartialLoader', 'GuestInfoService', 'EmployeeService', 'MessageHub', 'SignalRValue', 'focus',
    function ($scope, $state, $stateParams, $timeout, $translatePartialLoader, GuestInfoService, EmployeeService, MessageHub, SignalRValue, focus ) {
    'use strict';
    // variables for messages box
    $scope.offsetY = 0;
    $scope.invalidScrollUp = false;
    $scope.invalidScrollDown = false;
    $scope.inputing = false; // boolean flag showing the guest's typing status
    $scope.employeeTyping = false;

    $scope.guest = GuestInfoService.data;
    $scope.employeeData = EmployeeService.data;

    $scope.focused = false;

    $scope.messages=[
    ];

    // We are going to leave this page in case we don't have MessageHub defined.
    $scope.checkValidConnection = function() {
      if (MessageHub.hub === null) {
        $state.go('start', null, {location: 'replace'});
      }
    };

    /* Assign MessageHub Event Listners. */
    $scope.init = function() {
      $scope.checkValidConnection();
      if($stateParams.source === 'messageReceived')
      {
        $scope.messages.push({text: $stateParams.message.Content, status: 1});
      }


      if (MessageHub.hub !== null) {
        MessageHub.hub.on('contactAssigned', function(name, email) {
          console.log(name);
          console.log(email);
        });

        MessageHub.hub.on('statusUpdated', function(messageId, status) {
          console.log(status);
        });

        MessageHub.hub.on('messageReceived', function (message) {
          $scope.messages.push({text: message.Content, status: 1});
          $scope.employeeTyping = false;
        });

        MessageHub.hub.on('isTypingUpdated', function (typingStatus) {
          $scope.employeeTyping = typingStatus;
        });
      }


    };

    $scope.init();


    // When you have typed a new message, add it to the message list
    $scope.addMessage = function(text) {
      $scope.checkValidConnection();
      $scope.messages.push({text: text, status: 0});
      MessageHub.hub.invoke('sendMessage', SignalRValue.token, text);

      $scope.inputing = true;
      focus('chatBox')
      $scope.replyText = "";
      /*angular.element('.replyChatMessage').trigger('focus');
      angular.element('.replyChatMessage').trigger('click');
      angular.element('.replyChatMessage').trigger('mousedown');*/


    };


    // MessageHub.start();

    $scope.backToStart = function() {
      $state.go('start', null, {location: 'replace'});
    };

    /* Message part integration part*/
    $scope.swipeUp = function($event) {

      if ($scope.overflowed && !$scope.invalidScrollUp) {
        $scope.invalidScrollDown = false;
        $scope.offsetY = Math.max(0, $scope.offsetY+1);
      }
    };

    $scope.swipeDown = function($event) {

      if ($scope.overflowed && !$scope.invalidScrollDown) {
        $scope.invalidScrollUp = false;
        $scope.offsetY--;
      }
    };

    $scope.activateInput = function() {
      $scope.inputing = true;
    };

    $scope.overflowed = false;

    /*
    * Keyboard handler
    */
    $scope.openKeyboard = function() {
      $scope.keyboardVisible = true;
      $scope.$apply();
    };
    $scope.hideKeyboard = function() {
      $scope.keyboardVisible = false;
      $scope.$apply();
    };

  }]);
