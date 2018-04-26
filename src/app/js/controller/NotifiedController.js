angular
  .module('digitalreception.controllers')
  .controller('NotifiedController', ['$scope', '$state', '$interval', '$timeout', '$translate', '$translatePartialLoader', 'GuestInfoService', 'EmployeeService', 'MessageHub', 'SignalRValue',
    function ($scope, $state, $interval, $timeout, $translate, $translatePartialLoader, GuestInfoService, EmployeeService, MessageHub, SignalRValue) {
    'use strict';
    $translatePartialLoader.addPart('main');
    $translate.refresh();
    $scope.employee = EmployeeService.data;
    $scope.destroyed = false;

    if ( SignalRValue.token && MessageHub.hub !== null) {}
    else{
      MessageHub.initialize();
    }

    /* disconnect and move to list page if no response within 30 seconds */
    var waitingDuration = 0;
    var waitingInterval = 5000;
    var stop = $interval(function() {
      waitingDuration++;
      if (waitingDuration > 12) { // 5 seconds(5000 miliseconds) * 12 = 60 seconds.
        if($state.includes('notified')) { // double make sure we are on this page
          $interval.cancel(stop);
          $state.go('list', {source: 'timeout', contactee: $scope.employee});
        }
      }
    }, waitingInterval);

    var notifiedMessageReceivedHandler = function (message) {
      if($state.includes('notified'))
      {
        $interval.cancel(stop);
        $state.go('chat', {source: 'messageReceived', message: message}, {location: 'replace'});
      }
    };

    var notifiedTypingStatusHandler = function(typingStatus) {
        if (typingStatus && $state.includes('notified')) {
          $interval.cancel(stop);
          $state.go('chat', null, {location: 'replace'});
        }
    };




    MessageHub.hub.on('isTypingUpdated', notifiedTypingStatusHandler);
    MessageHub.hub.on('messageReceived', notifiedMessageReceivedHandler);


    MessageHub.hub.start();

    // Safely cancel timer and prevent callback to excute
    $scope.$on("$destroy", function() {
      // dobule make sure we are closing it.
      $interval.cancel(stop);
    });

    // Back to Employee List page
    $scope.goBackToList = function () {
      EmployeeService.data = {
        FullName: null,
        Email: null,
        Picture: null
      };
      $interval.cancel(stop);
      $state.go('list');
    };
  }]);
