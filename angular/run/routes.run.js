export function RoutesRun($log, $rootScope, $state) {
    'ngInject';


    let deregisterationCallback =  $rootScope.$on("$stateChangeStart", function(event, toState) {

        $rootScope.providerAddress = 'http://dev.23degree.org';

        if (angular.isDefined(toState.views))
            if (toState.views.hasOwnProperty('fullscreen@')) {
                $rootScope.fullscreenView = true;
            }
            else {
                $rootScope.fullscreenView = false;
            }


    });
    $rootScope.$on('$destroy', deregisterationCallback)
}
