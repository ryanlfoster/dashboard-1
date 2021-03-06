var module = angular.module('app',
    ['filters',
     'ui.utils',
     'ui.router',
     'ui.bootstrap',
     'ngSanitize']);

var filters = angular.module('filters', []);

// *************************************************************
// Delay start
// *************************************************************

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});

// *************************************************************
// States
// *************************************************************

module.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {

        $stateProvider

            .state('home', {
                url: '/',
                templateUrl: '/templates/home.html',
                controller: 'HomeCtrl'
            })

            .state('install', {
                url: '/install',
                templateUrl: '/templates/install.html',
                controller: 'InstallCtrl'
            })

            .state('repo', {
                url: '/:user/:repo',
                templateUrl: '/templates/repo.html',
                controller: 'RepoCtrl'
            });

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);

    }
])
.run(['$rootScope', '$state', '$stateParams',
    function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
]);
