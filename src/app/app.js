angular.module('digitalreception', [
  'ngResource',
  'ngCookies',
  'ngSanitize',
  'ngTouch',
  'angular-useragent-parser', 
  'angular-virtual-keyboard',
  'digitalreception.services',
  'digitalreception.directives',
  'digitalreception.controllers',
  'pascalprecht.translate',// angular-translate
  'ui.router',
  'swipe',
  'ngIdle',
  'ngLodash'
])
.constant('DEBUG_MODE', /*DEBUG_MODE*/true/*DEBUG_MODE*/)
.constant('VERSION_TAG', /*VERSION_TAG_START*/new Date().getTime()/*VERSION_TAG_END*/)
.constant('LOCALES', {
  'locales': {
      'nl_NL': 'Dutch',
      'en_US': 'English'
  },
  'preferredLocale': 'en_US'
})
.constant('SERVER_URL', 'http://digitalreception-backend.azurewebsites.net')
.value('SignalRValue', {token: null})
.config(function ($compileProvider, DEBUG_MODE) {
  'use strict';
  if (!DEBUG_MODE) {
    $compileProvider.debugInfoEnabled(false);// disables AngularJS debug info
  }
})
// Angular Translate
.config(function($translateProvider, $translatePartialLoaderProvider, LOCALES ) {
  'use strict';
  $translateProvider.useLoader('$translatePartialLoader', {
    urlTemplate: '/translation/{lang}/{part}.json'
  });

  $translateProvider.preferredLanguage(LOCALES.preferredLocale);// is applied on first load
})
.config(['IdleProvider', 'KeepaliveProvider', function(IdleProvider, KeepaliveProvider) {
    // configure Idle settings
    IdleProvider.idle(80); // in seconds
    IdleProvider.timeout(10); // in seconds
    // KeepaliveProvider.interval(2); // in seconds
}])
 .config(['TitleProvider', function(TitleProvider) {
  TitleProvider.enabled(false); // it is enabled by default
}])
 .config(['VKI_CONFIG', function(VKI_CONFIG) {
  VKI_CONFIG.relative = false;
  VKI_CONFIG.customClass = 'custom-keyboard';
 }])
.run(['$rootScope', '$state', 'Idle', 'SignalRValue', 'MessageHub', 'GuestInfoService', function($rootScope, $state, Idle, SignalRValue, MessageHub, GuestInfoService) {
  
  $rootScope.$on('$stateChangeStart', function (event, toState) {
    // Hide the virtual keyboard when moving between states
    if (angular.element('.custom-keyboard').length > 0) {
      angular.element('.custom-keyboard').remove();
    }
    // Safely closing SignalR connection
    if (SignalRValue.token != null && SignalRValue.token.length > 1 && ["notifying", "notified", "chat"].indexOf(toState.name) === -1) {
      if (MessageHub.hub && MessageHub.hub.connection && MessageHub.hub.connectionStatus.isConnected()) {
        MessageHub.hub.stop();
        MessageHub.hub = null;
      }
    }

    // Make sure we are free from touch scroll event flag
    window.inMove = false;
  });



  // the user has timed out (meaning idleDuration + timeout has passed without any activity)
  // We are moving back to welcome page
  $rootScope.$on('IdleTimeout', function() {
    $state.go('welcome', null, {location: 'replace'});
    GuestInfoService.data.name = null;
    Idle.watch();
  });

  // start watching when the app runs. also starts the Keepalive service by default.
  Idle.watch();
}]);