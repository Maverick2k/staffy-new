'use strict';

angular.module('app')
  .factory('Auth', [
    '$location',
    '$rootScope',
    '$http',
    '$cookieStore',
    '$q',
    'Config',
    'User',
    'Consts',
    '$resource',
    'Entity',
    '$window',

    function(
      $location,
      $rootScope,
      $http,
      $cookieStore,
      $q,
      Config,
      User,
      Consts,
      $resource,
      Entity,
      $window
    ) {

      var currentUser = {};
      var currentBusiness = {};

      var constants = Consts.get(function() {
        if ($window.localStorage.getItem('token') || $cookieStore.get('token')) {
          currentUser = User.get(function() {
            currentUser.skills = mergeSkills(currentUser.skills, constants.industries);
          });
        }
      });

      var industries = constants.industries;

      function mergeSkills(usersSkills, industries) {
        // build a default list

        var skills = [];
        for (var skill of industries) {
          var existingSkill = false;
          for (var obj of usersSkills) {
            if (obj.name.toLowerCase() == skill.toLowerCase()) {
              existingSkill = {
                name: obj.name,
                has: obj.has,
                rate: obj.rate
              };
              break;
            }
          }
          if (existingSkill) {
            skills.push(existingSkill);
          } else {
            skills.push({
              name: skill,
              has: false,
              rate: 0
            });
          }
        }
        return skills;
      }

      return {

        /**
         * Authenticate user and save token
         *
         * @param  {Object}   user     - login info
         * @param  {Function} callback - optional
         * @return {Promise}
         */
        login: function(user, callback) {
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.post(Config.ENV.AUTH_URL + '/local', {
            email: user.email,
            password: user.password
          }).
          success(function(data) {
            $window.localStorage.setItem('token', data.token);
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            deferred.resolve(data);
            return cb();
          }).
          error(function(err) {
            this.logout();
            deferred.reject(err);
            return cb(err);
          }.bind(this));

          return deferred.promise;
        },

        /**
         * Delete access token and user info
         *
         * @param  {Function}
         */
        logout: function() {
          $cookieStore.remove('token');
          $window.localStorage.removeItem('token');

          currentUser = {};
        },

        // when the user data us updated this service needs to be told.
        refresh: function() {
          if ($window.localStorage.getItem('token') || $cookieStore.get('token')) {
            currentUser = User.get(function() {
              currentUser.skills = mergeSkills(currentUser.skills, constants.industries);
            });
          }
        },
        /**
         * Create a new user
         *
         * @param  {Object}   user     - user info
         * @param  {Function} callback - optional
         * @return {Promise}
         */
        createUser: function(user, callback) {
          var cb = callback || angular.noop;

          return User.save(user,
            function(data) {
              $cookieStore.put('token', data.token);
              $window.localStorage.setItem('token', data.token);
              currentUser = User.get();
              return cb(user);
            },
            function(err) {
              this.logout();
              return cb(err);
            }.bind(this)).$promise;
        },

        createEntity: function(entity, callback) {
          var cb = callback || angular.noop;

          return Entity.save(entity,
            function(data) {
              $cookieStore.put('biz', data );
              $window.localStorage.setItem('biz', data);
              currentBusiness = Entity.get();
              return cb(currentBusiness);
            },
            function(err) {
              this.logout();
              return cb(err);
            }.bind(this)).$promise;
        },

        /**
         * Change password
         *
         * @param  {String}   oldPassword
         * @param  {String}   newPassword
         * @param  {Function} callback    - optional
         * @return {Promise}
         */
        changePassword: function(oldPassword, newPassword, callback) {
          var cb = callback || angular.noop;

          return User.changePassword({
            id: currentUser._id
          }, {
            oldPassword: oldPassword,
            newPassword: newPassword
          }, function(user) {
            return cb(user);
          }, function(err) {
            return cb(err);
          }).$promise;
        },

        /**
         * Gets all available info on authenticated user
         *
         * @return {Object} user
         */
        getCurrentUser: function() {
          return currentUser;
        },

        /**
         * Check if a user is logged in
         *
         * @return {Boolean}
         */
        isLoggedIn: function() {
          return currentUser.hasOwnProperty('role');
        },

        isWorker: function() {
          return currentUser.type == 'staffer';
        },

        isEmployer: function() {
          return currentUser.type != 'staffer' || currentUser.entityId;
        },

        getPicture: function() {
          if( currentUser.profileUrl ) {
            return( 'http://staffy-static-storage.s3.amazonaws.com/uploads/' + currentUser.profileUrl.name );
          }
          return( 'img/avatar-default.jpg' );
        },

        /**
         * Waits for currentUser to resolve before checking if user is logged in
         */
        isLoggedInAsync: function(cb) {
          if (currentUser.hasOwnProperty('$promise')) {
            currentUser.$promise.then(function() {
              cb(true);
            }).catch(function() {
              cb(false);
            });
          } else if (currentUser.hasOwnProperty('role')) {
            cb(true);
          } else {
            cb(false);
          }
        },

        /**
         * Check if a user is an admin
         *
         * @return {Boolean}
         */
        isAdmin: function() {
          return currentUser.role === 'admin';
        },

        /**
         * Get auth token
         */
        getToken: function() {
          return $window.localStorage.getItem('token') || $cookieStore.get('token');
        }
      };
    }
  ]);
