
module.controller('RepoCtrl', ['$scope', '$rootScope', '$stateParams', '$RAW', '$timeout', 'socket',
    function($scope, $rootScope, $stateParams, $RAW, $timeout, socket) {

        // set some defaults
        $scope.delay = 3;
        $scope.stats = [];
        $scope.branches = ['master'];
        $scope.notifications = [];

        $scope.equal = {width: '0%'};

        // get repo .dashboard.yml
        $scope.settings = $RAW.call('settings', {
            user: $stateParams.user,
            repo: $stateParams.repo
        }, function(err, settings) {
            if(!err) {
                $scope.stats = settings.stats instanceof Array ? settings.stats : $scope.stats;
                $scope.branches = settings.branches instanceof Array ? settings.branches : $scope.branches;
                $scope.delay = settings.delay ? settings.delay : $scope.delay;

                // equally space stats table
                if($scope.stats && $scope.stats.length) {
                    $scope.equal.width = (100 / $scope.stats.length) + '%';
                }
            } else {
                // $scope.notifications.push({
                //     icon: 'octicon octicon-issue-opened text-danger',
                //     title: err.message,
                //     message: 'You can read more about this in our <a href="/install">installation guide</a>'
                // });

                $scope.notifications.push({
                    icon: 'octicon octicon-heart text-danger',
                    title: 'Welcome to GitHub Dashboard',
                    message: 'Have you taken a sec to <a href="/install" target="_blank">set up your repo?</a><br /> We are always looking for contributions and suggestions, so please feel free to <a href="https://github.com/reviewninja/dashboard" target="_blank">let us know how we are doing.</a>',
                    delay: 0
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

        // status
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

        // push (new commit)
        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'push', function(args) {
            var branch = matchBranch(args.ref);
            if(branch) {
                $scope.notifications.push({
                    icon: 'octicon octicon-git-commit',
                    title: args.head_commit.message,
                    message: 'new commit from ' + args.head_commit.committer.username + ' to ' + branch,
                    delay: $scope.delay
                });
            }
        });

        // issues (opened, reopened, closed)
        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'issues', function(args) {
            if(args.action === 'opened' || args.action === 'reopened' || args.action === 'closed') {
                $scope.notifications.push({
                    icon: 'octicon octicon-issue-' + args.action + ' ' + (args.action === 'closed' ? 'text-success' : 'text-danger'),
                    title: args.issue.title,
                    message: args.action + ' by ' + args.sender.login,
                    delay: $scope.delay
                });
            }
        });

        // pull request (opened, closed, reopened, synchronize)
        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'pull_request', function(args) {
            if(args.action === 'opened' || args.action === 'reopened' || args.action === 'closed' || args.action === 'synchronize') {
                args.action = args.action === 'synchronize' ? 'new commits added' : args.action;
                $scope.notifications.push({
                    icon: 'octicon octicon-git-pull-request' + ' ' + (args.pull_request.state === 'closed' ? 'text-danger' : 'text-success'),
                    title: args.pull_request.title,
                    message: args.action + ' by ' + args.sender.login,
                    delay: $scope.delay
                });
            }
        });

        // repo forked
        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'fork', function(args) {
            $scope.notifications.push({
                icon: 'octicon octicon-repo-forked',
                title: args.sender.login + ' forked your repository',
                message: 'You now have ' + args.repository.forks + ' forks!',
                delay: $scope.delay
            });
        });

        // repo starred
        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'watch', function(args) {
            $scope.notifications.push({
                icon: 'octicon octicon octicon-star text-primary',
                title: args.sender.login + ' starred your repository',
                message: 'You now have ' + args.repository.stargazers_count + ' stars!',
                delay: $scope.delay
            });
        });
    }
]);
