angular.module('app.services', [])

.factory('BlankFactory', ['$resource', 'Config', function($resource, Config) {

}])

.factory('Notification', ['$resource', 'Config', function($resource, Config) {

    return $resource(Config.ENV.API_URL + '/notifications/:id/:controller', {
        id: '@_id'
    }, {
        myNotifications: {
            method: 'GET',
            params: {
                controller: 'myNotifications'
            }
        }
    });
}])

.factory('LoadedData', ['Config', 'Notification', function(Config, Notification) {
    var factory = {};

    factory.notifications = [];
    factory.loadedNotification = [];
    factory.loadedUser = [];
    factory.myNotifications = {};
    factory.unread = 0;
    factory.getNotifications = function() {
        factory.myNotifications = Notification.myNotifications();
    };

    return factory;
}])

.factory('Entity', ['$resource', 'Config', function($resource, Config) {

    return $resource(
        Config.ENV.API_URL + '/entitys/:id/:controller', {
            id: '@_id'
        }
    );
}])

.factory('Job', ['$resource', 'Config', function($resource, Config) {

    return $resource(
        Config.ENV.API_URL + '/jobs/:id/:controller', {
            id: '@_id'
        }
    );
}])

.factory('Question', ['$resource', 'Config', function($resource, Config) {

    return $resource(
        Config.ENV.API_URL + '/questions/:id/:controller', {
            id: '@_id'
        }
    );
}])

.factory('Review', ['$resource', 'Config', function($resource, Config) {

    return $resource(
        Config.ENV.API_URL + '/reviews/:id/:controller', {
            id: '@_id'
        }
    );
}])

.factory('Lead', ['$resource', 'Config', function($resource, Config) {

    return $resource(
        Config.ENV.API_URL + '/leads/:id/:controller', {
            id: '@_id'
        }
    );
}])

.service('Config', [function() {
    return {
        ENV: {
            // API_URL: 'http://localhost:9000/api',
            // AUTH_URL: 'http://localhost:9000/auth'
            API_URL: 'http://www.staffy.ca/api',
            AUTH_URL: 'http://www.staffy.ca/auth'
        }
    }
}])

.service('BlankService', [function() {

}])

.factory('Consts', [
    '$resource',
    'Config',
    function(
        $resource,
        Config
    ) {
        return $resource(Config.ENV.API_URL + '/industries/', {
            get: {
                method: 'GET',
            }
        });
    }
]);
