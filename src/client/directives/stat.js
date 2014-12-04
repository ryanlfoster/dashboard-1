// *****************************************************
// Stat Directive
// *****************************************************

module.directive('stat', ['$RAW', function($RAW) {
    return {
        restrict: 'E',
        templateUrl: '/templates/stat.html',
        scope: {
            url: '=',
            icon: '='

        },
        link: function(scope, element, attr) {
            scope.$watch('url', function() {
                if(scope.url) {
                    scope.info = $RAW.call('stat', {
                        url: scope.url
                    });
                }
            });
        }
    };
}]);
