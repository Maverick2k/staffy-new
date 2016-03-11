// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', [
  'ionic',
  'ionic.service.core',
  'app.controllers',
  'app.routes',
  'app.services',
  'app.directives',
  'ngCookies',
  'ngResource',
  'ngCordova'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
  
  var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
  if (app) {
    // $rootScope.mobile = true;
    // PhoneGap application
    //$rootScope.APIURL = '';
  } else {
    // $rootScope.mobile = false;
    // Web page
    //$rootScope.APIURL = '/api/';
  }

  $httpProvider.interceptors.push('authInterceptor');

  // $httpProvider.defaults.useXDomain = true;
  // delete $httpProvider.defaults.headers.common['X-Requested-With'];

})

.factory('authInterceptor', function($q, $cookieStore, $location, $window) {
  return {
    // Add authorization token to headers
    request: function(config) {
      config.headers = config.headers || {};
      if ($cookieStore.get('token')) {
        config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
      }
      if ($window.localStorage.getItem('token')) {
        config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('token');
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError: function(response) {
      if (response.status === 401) {
        $location.path('/login');
        // remove any stale tokens
        $cookieStore.remove('token');
        return $q.reject(response);
      } else {
        return $q.reject(response);
      }
    }
  }
})



;
