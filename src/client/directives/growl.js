// *****************************************************
// Growl Directive
// *****************************************************

module.directive('growl', function($timeout) {
    return {
        restrict: 'E',
        templateUrl: '/templates/notification.html',
        scope: {
            icon: '=',
            title: '=',
            message: '='

        },
        link: function(scope, element, attr) {

            var template = element[0].innerHTML;

            $.growl({
                icon: scope.icon,
                title: scope.title,
                message: scope.message
            },{
                type: 'notification',
                offset: {x: 20, y: 70},
                allow_dismiss: false,
                delay: 1000 * 60 * 3,
                template: template,
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutRight'
                }
            });
        }
    };
});