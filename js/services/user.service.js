'use strict';
angular.module('app')
  .factory('User', [
    '$resource',
    'Config',
    function(
      $resource,
      Config
    ) {

      return $resource(Config.ENV.API_URL + '/users/:id/:controller', {
          id: '@_id'
        }, {
          changePassword: {
            method: 'PUT',
            params: {
              controller: 'password'
            }
          },
          get: {
            method: 'GET',
            params: {
              id: 'me'
            }
          },
          list: {
            method: 'GET'
          },
          update: {
            method: 'PUT'
          },
          filter: {
            method: 'GET',
            params: {
              stars: '@stars',
              skill: '@skill'
            }
          },
          uploadProfile: {
            method: 'POST',
            url: Config.ENV.API_URL + '/users/avatar',
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          },
          getPicture: function() {

            if (this.profileUrl) {
              return ('http://staffy-static-storage.s3.amazonaws.com/uploads/' + this.profileUrl.name);
            }
            return ('img/avatar-default.jpg');
          }
        
      });
  }]);
