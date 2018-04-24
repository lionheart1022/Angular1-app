angular
  .module('digitalreception.controllers')
  .controller('EmployeeListController', ['$scope', '$timeout', '$state', '$stateParams', '$translate', '$translatePartialLoader', '$http', 'lodash', 'EmployeeService', 'SERVER_URL', 'focus',
    function ($scope, $timeout, $state, $stateParams, $translate, $translatePartialLoader, $http, lodash, EmployeeService, SERVER_URL, focus) {
    'use strict';
    $translatePartialLoader.addPart('main');
    $translate.refresh();

    $scope.currentPage = 0;
    $scope.itemsPerPage = 10;
    $scope.keyboardVisible = false;

    // Method List for better navigation
    $scope.init = {}; // Init function
    $scope.scheduleAppointment = {}; // Event handler when clicked on specific person: navigate to notifying page
    $scope.searchEmployee = {}; // where real search happens
    // Search panel display and hide
    $scope.showSearchPanel = {};
    $scope.resetSearch = {};

    $scope.getAvailability = {};
    $scope.moreFetch = {};
    $scope.openKeyboard = {};
    $scope.hideKeyboard = {};




    $scope.init = function() {
    	$scope.employeeList = null; // showing what's displayed for the user.
        $scope.fullList = null; // the full List of what we retrieve from server.
        $scope.reason = $stateParams.source; // one of 'meet', 'delivery', 'timeout' and null
        $scope.inSearch = true; // indicating we are in search period
        $scope.searchText = "";
        $scope.inLoadingMore = false; // when we load more items, we are going to show spinner or something like that.
        $scope.currentPage = 0;
        $scope.contactee = EmployeeService.data; // what user decided to contact
        $scope.noMore = false; // Indicate if we need to load more
        window.inMove = false; // very global variable to communicate with jquery smoothdivscroll plugin

        // Get the first 10 result.
		$http.get(SERVER_URL + '/Employees/List').then(
			function(data) {
				$scope.fullList = data.data; // All the data that we have pulled from server
				$scope.employeeList = data.data;
                $scope.getAvailability();
			},
			function(response) {
				console.log(response);
			});
    };

    $scope.init();

    // When any of employee is clicked.
    $scope.scheduleAppointment = function (employee) {
        $timeout(function() {
            if (window.inMove == false) { // && !(employee.status == 2 || employee.status == 3)) {
                $state.go('notifying', {employee: employee, reason: $scope.reason});
            }
        }, 10);
    };


    /* Search Section */
    // Real Search function
    $scope.searchEmployee = function(text) {
        $scope.searchedText = text;
    	if (text.length < 1) {
    		$scope.employeeList = $scope.fullList;
    	} else {
	    	$http.get(SERVER_URL + '/Employees/Search?query=' + text).then(
	    		function(data) {
                    if ($scope.searchedText == text) {
	    			    $scope.employeeList = data.data;
                        window.inMove = false;
                        $scope.getAvailability();
                        if (data.data.length < $scope.itemsPerPage) $scope.noMore = true; else $scope.noMore = false;
                    }


	    		},
	    		function(response) {
	    			console.log(response);
	    		});
	    }
    };

    $scope.showSearchPanel = function() {
        $scope.inSearch = true;
        window.inMove = false;
        focus('searchText');
    };

    $scope.resetSearch = function() {
        $scope.inSearch = true;
        window.inMove = false;
        $scope.employeeList = $scope.fullList;
    };

    /* Get Availability */
    $scope.getAvailability = function() {
        // Before availibility apis are going to be ready, we are going to return random number for now.

        // return (Math.random() > 0.5 ? 'green' : 'orange');
        var email_query_arrs = lodash.map($scope.employeeList, function(emp) {
            return "emails=" + emp.Email;
        });

        var email_query = email_query_arrs.join("&");

        $http.get(SERVER_URL + '/Employees/Availability?' + email_query).then(
            function(data) {
                lodash.each(data.data, function(item) {
                    // Email: "auctor@nuncinterdumfeugiat.edu",Id: 8
                    var index = lodash.findIndex($scope.employeeList, {Email: item.Email});
                    if (index >= 0) {
                        $scope.employeeList[index].status = getAvailabilityLevel(item.Id);
                        $scope.employeeList[index].ColorCode = item.ColorCode;
                    }
                });
            },
            function (response) {

            });
    };


    function getAvailabilityLevel(id) {
        var availabilityStatuses = [
        {"Name":"Unknown","Level":0,"Description":"User`s presence isn't known.","Id":0,"Email":null},
        {"Name":"Available","Level":1,"Description":"User is online and available to contact.","Id":1,"Email":null},
        {"Name":"Busy","Level":3,"Description":"User is busy and doesn't want to be interrupted.","Id":2,"Email":null},
        {"Name":"InCall","Level":3,"Description":"User is in a Skype for Business (Lync) call (a two-way audio call) and doesn't want to be disturbed.","Id":3,"Email":null},
        {"Name":"InMeeting","Level":3,"Description":"User is in a meeting and doesn't want to be disturbed.","Id":4,"Email":null},
        {"Name":"InConferenceCall","Level":3,"Description":"User is in a Skype for Business (Lync) conference call (a Skype for Business (Lync) Meeting with audio) and don't want to be disturbed.","Id":5,"Email":null},
        {"Name":"Presenting","Level":4,"Description":"User is giving a presentation and can't be disturbed.","Id":6,"Email":null},
        {"Name":"DoNotDisturb","Level":4,"Description":"User doesn't want to be disturbed and will see conversation notifications only if sent by someone in his Workgroup.","Id":7,"Email":null},
        {"Name":"BeRightBack","Level":2,"Description":"User is stepping away from the computer for a few moments.","Id":8,"Email":"auctor@nuncinterdumfeugiat.edu"},
        {"Name":"InactiveAway","Level":2,"Description":"User is logged on but his computer has been idle, or User has been been away from his computer for a specified (set by him) period of time.","Id":9,"Email":null},
        {"Name":"OffWork","Level":2,"Description":"User is not working and not available to be contacted.","Id":10,"Email":null},
        {"Name":"Offline","Level":0,"Description":"User is not signed in. User appears as Offline to people whom he has blocked from seeing your presence.","Id":11,"Email":null}];
        var record = lodash.find(availabilityStatuses, {Id: id});
        if (!record || !record.Level) {
            return null
        } else {
            return record.Level;
        }
    };

    $scope.moreFetch = function () {
        if ($scope.noMore === true) return;
        var paginationSurfix = 'start=' + ($scope.currentPage + 1) * $scope.itemsPerPage + "&limit=" + $scope.itemsPerPage;
        var url = SERVER_URL + '/Employees/List?' + paginationSurfix;

        if ($scope.searchedText && $scope.searchedText.length > 0) url = SERVER_URL + '/Employees/Search?query=' + $scope.searchedText + '&' + paginationSurfix;
        $scope.inLoadingMore = true;

        $http.get(url).then(
            function(data) {
                $scope.currentPage++;
                $scope.fullList = $scope.fullList.concat(data.data);
                $scope.employeeList = $scope.employeeList.concat(data.data);;
                $scope.getAvailability();
                $scope.inLoadingMore = false;
                if (data.data.length < $scope.itemsPerPage) $scope.noMore = true; else $scope.noMore = false;
            },
            function(response) {
                console.log(response);
                $scope.inLoadingMore = false;
            });
    };

    /* enter event handler from vk */
    // TODO: Very dirty code, should get back to it later.
    $scope.vkEnter = function() {
        $scope.searchEmployee(document.getElementById("searchText").value);
        angular.element('.custom-keyboard').hide();
        angular.element('.keyboard-root').removeClass('focused');
    };

    /* keyboard toggleing */
    $scope.openKeyboard = function() {
      $scope.keyboardVisible = true;
      $scope.$apply();
    };
    $scope.hideKeyboard = function() {
      $scope.keyboardVisible = false;
      // $scope.resetSearch();
      $scope.$apply();
    };


  }]);
