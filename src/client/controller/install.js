
module.controller('InstallCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$RAW',
    function($rootScope, $scope, $state, $stateParams, $RAW) {
        $scope.config = $RAW.call('config');
    }
]);
