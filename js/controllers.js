angular.module('app.controllers', [])

.controller('userCtrl', function($http, $scope, $ionicPopup, Auth, $location, $window, Consts, User, Job, LoadedData, Notification, Entity, Camera, $stateParams, $cordovaFileTransfer, Config, $state) {
	
	$scope.errors = {};
	$scope.staffers = User.query(function(data) {
	});

	$scope.stateParams = $stateParams;

	$scope.getCurrentUser = Auth.getCurrentUser;
	$scope.isEmployer = Auth.isEmployer;
	$scope.isWorker = Auth.isWorker;
	$scope.isLoggedIn = Auth.isLoggedIn;
	$scope.isAdmin = Auth.isAdmin;
	$scope.profilePic = Auth.getPicture;

	$scope.constants = Consts.get();
	$scope.industries = $scope.constants.industries;

	$scope.currentUser = Auth.getCurrentUser();
	$scope.filter = {};
	
	LoadedData.getNotifications();
	
	$scope.dataStore = LoadedData;
	$scope.dataStore.notifications = Auth.getCurrentUser.notifications;

	var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
	if (app) {
		$scope.mobile = true;
		// PhoneGap application
		//$rootScope.APIURL = '';
	} else {
		$scope.mobile = false;
		// Web page
		//$rootScope.APIURL = '/api/';
	}

	$scope.sendRequest = function(user, skill) {

		var job = new Job();
		job.skill = skill.name;
		job.rate = skill.rate;
		job.staffer = user;
		job.state = 'offer';
		job.indusrty = 'restaurant';
		job.creator = $scope.getCurrentUser();
		job.entity = $scope.getCurrentUser().entityId;
		job.active = true;

		job.$save(
			function(res) {
				var popup = $ionicPopup.alert({
					title: 'Request created',
					template: 'The user will be sent a notification.'
				});
				popup.then(function(res) {
					$state.go('navigation.yourPostings');
				});
			},
			function(err) {
				console.log(err);
			});
	}

	$scope.getProfilePic = function(profileUrl) {

		if (profileUrl) {
			return ('http://staffy-static-storage.s3.amazonaws.com/uploads/' + profileUrl.name);
		}
		return ('img/avatar-default.png');

	}

	$scope.filterStaffers = function() {

		$scope.staffers = User.query({
			stars: $scope.filter.stars,
			skill: $scope.filter.skill
		});

	};

	$scope.updateSkills = function() {
		user = new User();
		user._id = Auth.getCurrentUser()._id;
		user.skills = Auth.getCurrentUser().skills;

		// done at the final screen offer buttons to update rates
		user.$save(function(res) {
			$location.path('/nav/profile-staffer-page');
		});

	};

	$scope.updateAvailability = function() {
		user = new User();
		user._id = Auth.getCurrentUser()._id;
		user.availability = Auth.getCurrentUser().availability;

		// done at the final screen offer buttons to update rates
		user.$save(function(res) {
			$location.path('/nav/profile-staffer-page');
		});

	};

	$scope.updateProfile = function() {
		user = new User();
		user._id = Auth.getCurrentUser()._id;
		user.address = Auth.getCurrentUser().address;
		user.phoneNumber = Auth.getCurrentUser().phoneNumber;
		user.firstName = Auth.getCurrentUser().firstName;
		user.lastName = Auth.getCurrentUser().lastName;
		user.about = Auth.getCurrentUser().about;

		user.$save(function(res) {
			$location.path('/nav/profile-staffer-page');
		});

	};

	$scope.updateEntityProfile = function() {
		entity = new Entity();
		entity._id = Auth.getCurrentUser().entityId._id;
		entity.address = Auth.getCurrentUser().entityId.address;
		entity.phoneNumber = Auth.getCurrentUser().entityId.phoneNumber;
		entity.name = Auth.getCurrentUser().entityId.name;
		entity.email = Auth.getCurrentUser().entityId.email;
		entity.description = Auth.getCurrentUser().entityId.description;
		entity.contactPerson = Auth.getCurrentUser().entityId.contactPerson;

		entity.$save(function(res) {
			$location.path('/nav/profile-entity-page');
		});

	};

	$scope.cancelUpdate = function() {
		$location.path('/nav/profile-staffer-page');
	};

	$scope.getSelectedUser = function() {
		return $scope.dataStore.loadedUser;
	};
	$scope.getSelectedNotification = function() {
		return $scope.dataStore.loadedNotification;
	};

	$scope.viewNotification = function(obj) {
		$scope.dataStore.loadedNotification = Notification.get({
			id: obj._id
		}, function(res) {
			console.log( res );
			// $scope.dataStore.loadedNotification = res;
			$state.go('navigation.notification');
		});
	};

	$scope.viewStaffer = function(id) {
		$scope.dataStore.loadedUser = User.get({
			id: id
		}, function(err) {});
		$state.go('navigation.viewstaffer');
	};

	$scope.getPhoto = function() {

		var options = {};

		if (navigator.camera) {
			options = {
				// quality: 75,
				destinationType: navigator.camera.DestinationType.FILE_URL,
				sourceType: navigator.camera.PictureSourceType.CAMERA,
				// allowEdit: false,
				// encodingType: navigator.camera.EncodingType.PNG,
				targetWidth: 500,
				targetHeight: 500,
				// popoverOptions: navigator.camera,
				// saveToPhotoAlbum: true,
				// cameraDirection: navigator.camera.Direction.FRONT
				// saveToPhotoAlbum: false,
				cameraDirection: navigator.camera.Direction.FRONT,
				correctOrientation: true
			};

			var uploadOptions = {
				fileKey: 'images',
				fileName: 'avatar.png',
				chunkedMode: false,
				mimeType: 'image/png',
				headers: {
					Authorization: 'Bearer ' + $window.localStorage.getItem('token')
				}
			};

			navigator.camera.getPicture(
				function(result) {
					var user = new User();
					// user.$uploadProfile(result);
					$cordovaFileTransfer.upload(Config.ENV.API_URL + '/users/avatar', result, uploadOptions, true)
						.then(function(res) {
							console.log(res);
							Auth.refresh();
						}, function(err) {
							console.log(err);
						});

				},
				function(err) {
					console.log(err);
					options.sourceType = navigator.camera.PictureSourceType.PHOTOLIBRARY;
					navigator.camera.getPicture(
						function(result) {

							// var user = new User();
							// user.$uploadProfile(result);
							$cordovaFileTransfer.upload(Config.ENV.API_URL + '/users/avatar', result, uploadOptions, true)
								.then(function(res) {
									console.log(res);
									Auth.refresh();

								}, function(err) {
									console.log(err);
								});
						},
						function(err) {
							console.log(err);
						}, options);

				}, options);
		} else {
			console.log('Currently only supported on mobile apps');
		}

		// Camera.getPicture().then(function(imageURI) {
		// 	user = new User();
		// 	user.$uploadProfile(imageURI);
		// 	console.log(imageURI);
		// }, function(err) {
		// 	var popup = $ionicPopup.alert({
		// 		title: 'there was a problem' || err.name || err.data.name,
		// 		template: err
		// 	});
		// 	popup.then();
		// });
	};

})

.controller('loginCtrl', function($scope, Auth, $location, $window, $ionicPopup) {
	$scope.user = {};
	$scope.errors = {};
	$scope.isEmployer = Auth.isEmployer;
	$scope.isWorker = Auth.isWorker;
	$scope.isLoggedIn = Auth.isLoggedIn;
	$scope.isAdmin = Auth.isAdmin;
	$scope.getCurrentUser = Auth.getCurrentUser;

	$scope.login = function(form) {
		$scope.submitted = true;

		if (form.$valid) {
			Auth.login({
					email: $scope.user.email,
					password: $scope.user.password
				})
				.then(function() {
					// Logged in, redirect to home
					console.log('logged in');
					$location.path('/');
				})
				.catch(function(err) {
					console.log(err);
					var popup = $ionicPopup.alert({
						title: 'there was a problem' || err.name || err.data.name,
						template: err.message || err.data.message
					});
					popup.then();
				});
		}
	};

	$scope.loginOauth = function(provider) {
		$window.location.href = '/auth/' + provider;
		// SERVER_URL + '/auth/' + provider;
	};

	$scope.logout = function() {
		Auth.logout();
		$location.path('/login');
	};

})

.controller('signupCtrl', function($scope, Auth, $location, $window, $ionicPopup, Consts, User) {
	$scope.isLoggedIn = Auth.isLoggedIn;
	$scope.getCurrentUser = Auth.getCurrentUser;
	$scope.currentUser = Auth.getCurrentUser();
	$scope.constants = Consts.get();
	$scope.industries = $scope.constants.industries;

	$scope.industryModels = {};

	$scope.user = {
		address: {
			street: '',
			code: '',
			city: ''
		},
		skills: []
	};

	$scope.biz = {
		address: {},
		type: 'restaurant'
	};
	$scope.errors = {};

	$scope.register = function(form) {

		$scope.submitted = true;

		if ($scope.user.password !== $scope.user.passwordConfirm) {
			var popup = $ionicPopup.alert({
				title: 'Validation Error',
				template: 'The passwords dont match.'
			});
			popup.then();
			return;
		}

		if (form.$valid && $scope.user.email && $scope.user.password) {
			Auth.createUser({
					email: $scope.user.email,
					password: $scope.user.password,
					firstName: $scope.user.firstName,
					lastName: $scope.user.lastName,
					phoneNumber: $scope.user.phoneNumber,
					address: $scope.user.address,
					about: $scope.user.about,
					type: 'staffer',
					// industry: $scope.user.industry
				})
				.then(function(data) {

					var popup = $ionicPopup.alert({
						title: 'Success!',
						template: 'Okay, only a couple more steps...'
					});
					popup.then(function(res) {
						$scope.user = Auth.getCurrentUser;
						// Logged in, redirect to home
						$location.path('/ob-account-type');
					})

				})
				.catch(function(err) {

					var popup = $ionicPopup.alert({
						title: err.data.name,
						template: err.data.message
					});
					popup.then();

					$scope.errors.other = err.data.message;
				});
		} else {
			var popup = $ionicPopup.alert({
				title: 'There was a problem!',
				template: 'please fill out all fields as directed'
			});
			popup.then();
			$scope.errors.other = 'please fill out all fields as directed';
		}
	};

	$scope.setStafferData = function(form) {

		user = new User();
		user._id = Auth.getCurrentUser()._id;
		user.skills = [];

		for (var k in $scope.industryModels) {
			if ($scope.industryModels[k]) {
				user.skills.push({
					name: k,
					has: true,
					rate: 10
				});
			}
		}

		// done at the final screen offer buttons to update rates
		user.$save(function(res) {
			Auth.refresh();
			$location.path('/ob-verify-message');
		});

	}

	$scope.registerBussiness = function(form) {

		if (!$scope.isLoggedIn()) {
			var popup = $ionicPopup.alert({
				title: 'Not logged in',
				template: 'You must be logged in to create register a business.'
			});
			popup.then(function(res) {
				$location.path('/nav/login');
			})
			return;
		}

		if (form.$valid && $scope.biz.type && $scope.biz.name) {
			Auth.createEntity({
					name: $scope.biz.name,
					email: $scope.biz.email,
					phoneNumber: $scope.biz.phoneNumber,
					address: $scope.biz.address,
					contactPerson: $scope.biz.contactPerson,
					type: $scope.biz.type,
					description: $scope.biz.description,
				})
				.then(function(entity) {

					// update the logged in user with the entity and user type
					user = new User();
					user._id = Auth.getCurrentUser()._id;
					user.entityId = entity;
					user.type = "employer";

					user.$save().then(function(user) {

							// relead user data
							Auth.refresh();
							var popup = $ionicPopup.alert({
								title: 'Success, Business registered and linked',
								template: 'Click ok to get started.'
							});
							popup.then(function(res) {
								// $scope.user = Auth.getCurrentUser;
								$location.path('/ob-verify-message');
							})
						})
						.catch(function(err) {
							var popup = $ionicPopup.alert({
								title: err.data.name,
								template: err.data.message
							});
							popup.then();
						});
				})
				.catch(function(err) {
					var popup = $ionicPopup.alert({
						title: err.data.name,
						template: err.data.message
					});
					popup.then();
				});
		} else {
			var popup = $ionicPopup.alert({
				title: 'There was some missing data',
				template: 'please fill out all fields as directed'
			});
			popup.then();
		}
	};

	$scope.loginOauth = function(provider) {
		$window.location.href = '/auth/' + provider;
		// SERVER_URL + '/auth/' + provider;
	};

	$scope.setType = function(type) {
		$scope.user.type = type;
	}

})

.controller('non-AuthenticatedHomeCtrl', function($scope) {

})

.controller('setAvailabilityCtrl', function($scope) {

})

.controller('profileCtrl', function($scope) {

})

.controller('viewStaffersCtrl', function($scope) {

})

.controller('helpCtrl', function($scope, Question, Auth, $location, $ionicPopup) {

	$scope.data = {
		question: ''
	};
	$scope.errors = {};
	$scope.postQuestion = function() {
		question = new Question();
		question.body = $scope.data.question;
		question.userId = Auth.getCurrentUser()._id;
		question.$save(question)
			.then(function() {
				// Logged in, redirect to home
				var popup = $ionicPopup.alert({
					title: 'Success!',
					template: 'This issue has been logged and we will get back to you ASAP. Thanks.'
				});
				popup.then(function(res) {
					$location.path('/');
				})

			})
			.catch(function(err) {
				$scope.errors.other = err.message;
			});
	};

})

.controller('yourPostingsCtrl', function($scope) {

})

.controller('paymentHistoryCtrl', function($scope) {

})

.controller('stafferDetailCtrl', function($scope) {

})

.controller('offerDetailCtrl', function($scope) {

})

.controller('requestAcceptedCtrl', function($scope) {

})

.controller('skillsAndRatesCtrl', function($scope) {

})

.controller('editProfileCtrl', function($scope) {

})
