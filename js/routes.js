angular.module('app.routes', [])

.config(function(
  $stateProvider,
  $urlRouterProvider
) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('navigation', {
      url: '/nav',
      abstract: true,
      // templateUrl: 'templates/rubyonic/menu.html',
      templateUrl: 'templates/navigation.html',
      controller: 'loginCtrl as ctrl'
    })

  .state('navigation.login', {
    url: '/login',
    views: {
      'side-menu21': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl as ctrl'
      }
    }
  })

  .state('navigation.non-AuthenticatedHome', {
    url: '/index',
    views: {
      'side-menu21': {
        // templateUrl: 'templates/rubyonic/feed.html',
        templateUrl: 'templates/non-AuthenticatedHome.html',
        controller: 'userCtrl'
      }
    }
  })

  .state('navigation.setAvailability', {
    url: '/set-availability',
    views: {
      'side-menu21': {
        templateUrl: 'templates/setAvailability.html',
        controller: 'userCtrl'
      }
    }
  })

  .state('navigation.notification', {
    url: '/notification/:id',
    views: {
      'side-menu21': {
        templateUrl: 'templates/notification.html',
        controller: 'userCtrl'
      }
    }
  })

  .state('navigation.viewstaffer', {
    url: '/viewstaffer/:id',
    views: {
      'side-menu21': {
        templateUrl: 'templates/viewstaffer.html',
        controller: 'userCtrl'
      }
    }
  })
  .state('navigation.profile', {
    url: '/profile-staffer-page',
    views: {
      'side-menu21': {
        templateUrl: 'templates/profile.html',
        controller: 'userCtrl'
      }
    }
  })
  .state('navigation.profileEntity', {
    url: '/profile-entity-page',
    views: {
      'side-menu21': {
        templateUrl: 'templates/profileEntity.html',
        controller: 'userCtrl'
      }
    }
  })

  // .state('stafferProfile', {
  //   url: '/profile-staffer',
  //   abstract: true,
  //   templateUrl: 'templates/stafferProfile.html'
  // })

  .state('navigation.viewStaffers', {
    url: '/browse-staffers',
    views: {
      'side-menu21': {
        templateUrl: 'templates/viewStaffers.html',
        controller: 'userCtrl'
      }
    }
  })

  .state('navigation.help', {
    url: '/log-issue',
    views: {
      'side-menu21': {
        templateUrl: 'templates/help.html',
        controller: 'helpCtrl'
      }
    }
  })

  .state('navigation.yourPostings', {
    url: '/postings',
    templateUrl: 'templates/yourPostings.html',
    controller: 'userCtrl'
  })

  .state('businessManagment.paymentHistory', {
    url: '/accounting-bussiness',
    views: {
      'tab6': {
        templateUrl: 'templates/paymentHistory.html',
        controller: 'paymentHistoryCtrl'
      }
    }
  })

  .state('businessManagment', {
    url: '/business-managment',
    abstract: true,
    templateUrl: 'templates/businessManagment.html'
  })

  .state('stafferDetail', {
    url: '/staffer-detail',
    templateUrl: 'templates/stafferDetail.html',
    controller: 'userCtrl'
  })

  .state('offerDetail', {
    url: '/offer-detail',
    templateUrl: 'templates/offerDetail.html',
    controller: 'offerDetailCtrl'
  })

  .state('requestAccepted', {
    url: '/job-accept',
    templateUrl: 'templates/requestAccepted.html',
    controller: 'requestAcceptedCtrl'
  })

  .state('navigation.skills', {
    url: '/skills',
    views: {
      'side-menu21': {
        templateUrl: 'templates/skillsAndRates.html',
        controller: 'userCtrl'
      }
    }
  })

  .state('editProfile', {
    url: '/profile-edit',
    templateUrl: 'templates/editProfile.html',
    controller: 'userCtrl'
  })
  .state('editProfileEntity', {
    url: '/profile-entity-edit',
    templateUrl: 'templates/editProfileEntity.html',
    controller: 'userCtrl'
  })

  ///////////////////////// ON BOARDING ///////////////////////

  .state('navigation.signup', {
    url: '/signup',
    views: {
      'side-menu21': {
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
      }
    }
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('accountType', {
    url: '/ob-account-type',
    templateUrl: 'templates/accountType.html',
    controller: 'signupCtrl'
  })

  .state('stafferSignup', {
    url: '/ob-staffer-info',
    templateUrl: 'templates/stafferSignup.html',
    controller: 'signupCtrl'
  })

  .state('businessSignup', {
    url: '/ob-business-info',
    templateUrl: 'templates/businessSignup.html',
    controller: 'signupCtrl'
  })

  .state('eULA', {
    url: '/ob-eula',
    templateUrl: 'templates/eULA.html',
    controller: 'loginCtrl'
  })

  .state('onBoardingComplete', {
    url: '/ob-verify-message',
    templateUrl: 'templates/onBoardingComplete.html',
    controller: 'userCtrl'
  })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/nav/index');


});
