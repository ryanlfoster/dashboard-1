
module.controller('RepoCtrl', ['$scope', '$rootScope', '$stateParams', '$RAW', 'socket',
    function($scope, $rootScope, $stateParams, $RAW, socket) {

        var branches = ['master'];

        $scope.notifications = [];

        $scope.settings = $RAW.call('settings', {
            user: $stateParams.user,
            repo: $stateParams.repo
        }, function(err, settings) {
            if(!err && settings.branches instanceof Array) {
                branches = settings.branches;
            }
        });

        //
        // Helper functions
        //

        var hasBranch = function(_branches) {
            var match = null;
            _branches.forEach(function(branch) {
                if(branches.indexOf(branch.name) !== -1) {
                    match = branch.name;
                }
            });

            return match;
        };

        //
        // Websockets
        //

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'status', function(args) {
            var branch = hasBranch(args.branches);
            if(branch) {
                $scope.status = {
                    state: args.state,
                    context: args.context,
                    description: args.description,
                    branch: branch
                };

                // sets body background
                $rootScope.state = args.state;
            }
        });

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'issues', function(args) {
            if(args.action === 'opened' || args.action === 'reopened' || args.action === 'closed') {
                $scope.notifications.push({
                    icon: 'octicon octicon-issue-' + args.action + ' ' + (args.action === 'closed' ? 'text-success' : 'text-danger'),
                    title: args.issue.title,
                    message: args.action + ' by ' + args.sender.login
                });
            }
        });

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'pull_request', function(args) {
            if(args.action === 'opened' || args.action === 'reopened' || args.action === 'closed' || args.action === 'synchronize') {
                args.action = args.action === 'synchronize' ? 'new commits added' : args.action;
                $scope.notifications.push({
                    icon: 'octicon octicon-git-pull-request' + ' ' + (args.pull_request.state === 'closed' ? 'text-danger' : 'text-success'),
                    title: args.pull_request.title,
                    message: args.action + ' by ' + args.sender.login
                });
            }
        });

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'watch', function(args) {
            if(args.action === 'started') {
                $scope.notifications.push({
                    icon: 'octicon octicon octicon-star text-primary',
                    title: args.sender.login + ' starred your repository',
                    message: 'You now have ' + args.repository.stargazers_count + ' stars!'
                });
            }
        });
    }
]);
