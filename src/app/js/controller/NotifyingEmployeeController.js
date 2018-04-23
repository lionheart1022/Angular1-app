angular
  .module('digitalreception.controllers')
  .controller('NotifyingEmployeeController',
    ['$scope', '$http', '$state', '$stateParams', '$interval', '$timeout', '$translate', '$translatePartialLoader', 'GuestInfoService', 'EmployeeService', 'SERVER_URL', 'SignalRValue',
    function ($scope, $http, $state, $stateParams, $interval, $timeout, $translate, $translatePartialLoader, GuestInfoService, EmployeeService, SERVER_URL, SignalRValue) {
    'use strict';
    $translatePartialLoader.addPart('main');
    $translate.refresh();
    EmployeeService.data = $stateParams.employee;
    $scope.employee = $stateParams.employee;
    var stop;

    $scope.init = function () {
      var reason = $stateParams.reason;
      // If not 'delivery', we should ask guest to input thier name
      if (!GuestInfoService.data.name && reason !== 'delivery' ) {
        $state.go('signup');
        return;
      }

      // We are going to need this variable in the view to display translated message.
      $scope.translationData = {
        value: $scope.employee.FullName
      };

      /* disconnect and move to list page if no response within 30 seconds */
      var waitingDuration = 0;
      var waitingInterval = 5000;
      stop = $interval(function() {
        waitingDuration++;
        if (waitingDuration > 6) { // 5 seconds(5000 miliseconds) * 6 = 30 seconds.
          $interval.cancel(stop);
          $state.go('list', {source: 'timeout'});
        }
      }, waitingInterval);

      // visit type: 0=Appointment, 1=Training, 2=Delivery
      var type = 0; // Default 0
      if (reason === 'training') type = 1;
      if (reason === 'delivery') type = 2;

      // prepare the data to call session start
      var data = {
        Type : type,
        Visitor : {
            Name: GuestInfoService.data.name,
            Company: GuestInfoService.data.company
        }
      };

      // we are leaving it out for team notification, but in case we have record for employee, we sure handle them.
      if ($scope.employee && $scope.employee.Email) {
        data['EmployeeMail'] = $scope.employee.Email;
      }

      data['lang'] = $translate.use();

      // api call to get SignalR token
      $http.post(SERVER_URL + '/session/start', data).then(function successfulCallback(response) {
        if($state.includes('notifying')) { // double make sure we are on this page
          // First clear the timer
          $interval.cancel(stop);

          // store valuable token information
          SignalRValue.token = response.data.SessionId;

          // transition to next state
          $state.go('notified', null, {location: 'replace'});
        }
      }, function errorCallback(response) {
        if($state.includes('notifying')) { // double make sure we are on this page
          console.log('Error while creating session', response);
          // clear the timer
          $interval.cancel(stop);
          // Move to list page
          $state.go('list', {source: 'timeout'});
        }
      });

    };

    $scope.init();

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
