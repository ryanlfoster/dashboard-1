
module.controller('HomeCtrl', ['$rootScope', '$scope', '$timeout',
    function($rootScope, $scope, $timeout) {

        $scope.style = {'margin-top': '2000px'};

        $timeout(function() {
            $scope.ready = true;
            $scope.style['margin-top'] = '0';
        }, 20);
    }
]);
