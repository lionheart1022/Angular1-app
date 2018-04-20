angular
  .module('digitalreception')
  .config(function($stateProvider, $urlRouterProvider) {
    'use strict';
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/welcome');
    //
    // Now set up the states
    $stateProvider
      .state('welcome', {
        url: '/welcome',
        controller: 'WelcomeController',
        templateUrl: '/digitalreception/templates/welcome.html'
      })
      .state('start', {
        url: '/start',
        controller: 'StartController',
        templateUrl: '/digitalreception/templates/start.html'
      })
      .state('signup', {
        url: '/signup',
        controller: 'SignUpController',
        templateUrl: '/digitalreception/templates/signup.html'
      })
      .state('list', {
        url: '/list',
        params: {source: null},
        controller: 'EmployeeListController',
        templateUrl: '/digitalreception/templates/employee_list.html'
      })
      .state('delivery-target', {
        url: '/delivery-target',
        controller: 'DeliveryTargetController',
        templateUrl: '/digitalreception/templates/delivery_target.html'
      })
      .state('notifying', {
        url: '/notifying',
        params: {employee: null, reason: null},
        controller: 'NotifyingEmployeeController',
        templateUrl: '/digitalreception/templates/notifying.html'
      })
      .state('notified', {
        url: '/notified',
        params: {employee: null},
        controller: 'NotifiedController',
        templateUrl: '/digitalreception/templates/notified.html'
      })
      .state('chat', {
        url: '/chat',
        params: {employee: null, source: null, message: null},
        controller: 'ChatController',
        templateUrl: '/digitalreception/templates/chat.html'
      });
  });
