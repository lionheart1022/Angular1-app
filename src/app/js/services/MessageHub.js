angular
	.module('digitalreception.services')
	.factory('MessageHub', ['HubProxy', 'SERVER_URL', function(Hub, SERVER_URL) {
		'use strict';
		return {
			hub: null,
			initialize: function() {
				// Create the messageHub instance with logging enabled
				var messageHub = new Hub('chatHub', { connectionPath: SERVER_URL + '/signalr', loggingEnabled: true });
				// Return the message hub instance
				this.hub = messageHub;
			}
		}


	}]);
