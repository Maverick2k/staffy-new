'use strict';
angular.module('app.controllers')
	.controller('loginCtrl', function($scope, Auth, $location, $window, Config) {
		$scope.user = {};
		$scope.errors = {};

		$scope.login = function(form) {
			console.log( form );
			$scope.submitted = true;

			if (form.$valid) {
				Auth.login({
					debugger;
						email: $scope.user.email,
						password: $scope.user.password
					})
					.then(function() {
						// Logged in, redirect to home
						$location.path('/nav/profile-staffer-page');
					})
					.catch(function(err) {
						$scope.errors.other = err.message;
					});
			}
		};

		$scope.loginOauth = function(provider) {
			// $window.location.href = '/auth/' + provider;
			Config.AUTH_URL + provider;
		};
	});
