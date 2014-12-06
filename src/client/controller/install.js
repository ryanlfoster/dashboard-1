
module.controller('InstallCtrl', ['$rootScope', '$scope', '$state', '$RAW',
    function($rootScope, $scope, $state, $RAW) {
        $scope.config = $RAW.call('config');
    }
]);
