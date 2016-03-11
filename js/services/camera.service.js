'use strict';

angular.module('app')
  .factory('Camera', [
    '$q',
    function(
      $q
    ) {

      return {
        getPicture: function(options) {
          var q = $q.defer();
          options = {
            quality: 75,
            // destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.PNG,
            targetWidth: 250,
            targetHeight: 250,
            // popoverOptions: CameraPopoverOptions,
            // saveToPhotoAlbum: false,
            cameraDirection: Camera.Direction.FRONT
          };

          navigator.camera.getPicture(function(result) {
            // Do any magic you need
            q.resolve(result);
          }, function(err) {
            q.reject(err);
          }, options);

          return q.promise;
        }
      }
    }
  ]);
