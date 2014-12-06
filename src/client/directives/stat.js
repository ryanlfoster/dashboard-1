// *****************************************************
// Stat Directive
// *****************************************************

module.directive('stat', ['$RAW', '$timeout', function($RAW, $timeout) {
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
                    var refresh = function() {
                        scope.stat = $RAW.call('dashboard', 'statistic', {
                            url: scope.url
                        }, function(err, stat) {
                            if(!err) {
                                scope.text = stat.text;
                            }
                        });

                        $timeout(refresh, 60000);
                    };
                    refresh();
                }
            });
        }
    };
}]);
