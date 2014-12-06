
module.controller('HomeCtrl', ['$rootScope', '$scope', '$timeout',
    function($rootScope, $scope, $timeout) {
        $timeout(function() {
            $scope.ready = true;
        }, 20);
    }
]);
