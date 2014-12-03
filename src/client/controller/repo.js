
module.controller('RepoCtrl', ['$scope', '$rootScope', '$stateParams', 'socket',
    function($scope, $rootScope, $stateParams, socket) {

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
