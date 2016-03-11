angular.module('app.directives', [])

.directive('blankDirective', [function() {

}])

.directive('starrating', [function() {
	return {
		restrict: 'E',
		scope: {
			stars: '='
		},
		templateUrl: 'js/directives/starRating.html',
		compile: function( e, a ){
			
		},
		link: function( $scope, e, a ){
			console.log( $scope.stars );
		}
	};
}]);
