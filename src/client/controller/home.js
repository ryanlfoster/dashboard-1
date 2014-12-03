
module.controller('HomeCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$window',
    function($rootScope, $scope, $state, $stateParams, $window) {
        $scope.origin = $window.location.origin;

        $scope.getRepo = function(name) {
            $scope.user = null;
            $scope.repo = null;

            var tokens = name.split('/');

            if(tokens[0] && tokens[1]) {
                $scope.user = tokens[0];
                $scope.repo = tokens[1];
            }
        };
    }
]);
