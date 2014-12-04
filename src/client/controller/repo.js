
module.controller('RepoCtrl', ['$scope', '$rootScope', '$stateParams', '$RAW', 'socket',
    function($scope, $rootScope, $stateParams, $RAW, socket) {

        $scope.stats = [];

        $scope.branches = ['master'];

        $scope.notifications = [];

        $scope.settings = $RAW.call('settings', {
            user: $stateParams.user,
            repo: $stateParams.repo
        }, function(err, settings) {
            if(!err) {
                $scope.stats = settings.stats instanceof Array ? settings.stats : $scope.stats;
                $scope.branches = settings.branches instanceof Array ? settings.branches : $scope.branches;
            } else {
                $scope.notifications.push({
                    icon: 'octicon octicon-issue-opened text-danger',
                    title: err.message,
                    message: 'You can read more about this in our <a href="/install">installation guide</a>'
                });
            }
        });

        //
        // Helper functions
        //

        var hasBranch = function(branches) {
            var match = null;
            branches.forEach(function(branch) {
                if($scope.branches.indexOf(branch.name) !== -1) {
                    match = branch.name;
                }
            });

            return match;
        };

        var matchBranch = function(ref) {
            var match = null;
            $scope.branches.forEach(function(branch) {
                var regex = new RegExp(branch);
                if(regex.exec(ref)) {
                    match = branch;
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

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'push', function(args) {
            var branch = matchBranch(args.ref);
            if(branch) {
                $scope.notifications.push({
                    icon: 'octicon octicon-git-commit',
                    title: args.head_commit.message,
                    message: 'new commit from ' + args.head_commit.committer.username + ' to ' + branch
                });
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

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'fork', function(args) {
            $scope.notifications.push({
                icon: 'octicon octicon-repo-forked',
                title: args.sender.login + ' forked your repository',
                message: 'You now have ' + args.repository.forks + ' forks!'
            });
        });

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'watch', function(args) {
            $scope.notifications.push({
                icon: 'octicon octicon octicon-star text-primary',
                title: args.sender.login + ' starred your repository',
                message: 'You now have ' + args.repository.stargazers_count + ' stars!'
            });
        });
    }
]);
