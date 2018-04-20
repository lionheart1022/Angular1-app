angular
  .module('digitalreception.services')
  .factory('EmployeeService', function() {
    'use strict';
    return {
    	data: {
	    	FullName: null,
	    	Email: null,
	    	Picture: null
	    }
    };
  });
