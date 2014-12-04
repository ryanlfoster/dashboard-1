
module.controller('RepoCtrl', ['$scope', '$rootScope', '$stateParams', '$RAW', 'socket',
    function($scope, $rootScope, $stateParams, $RAW, socket) {

        $scope.settings = $RAW.call('settings', {
            user: $stateParams.user,
            repo: $stateParams.repo
        });

        //
        // Websockets
        //

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'status', function(args) {
            $scope.status = {
                state: args.state,
                context: args.context,
                description: args.description
            };

            $rootScope.state = args.state;
        });
    }
]);
