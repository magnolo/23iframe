export function RoutesRun($log, $rootScope, $state) {
    'ngInject';

    $rootScope.isLoading = true;
    let deregisterationCallback =  $rootScope.$on("$stateChangeStart",(event, toState)  => {

        $rootScope.providerAddress = 'http://dev.23degree.org';

        if (angular.isDefined(toState.views))
            if (toState.views.hasOwnProperty('fullscreen@')) {
                $rootScope.fullscreenView = true;
            }
            else {
                $rootScope.fullscreenView = false;
            }


    });
    $rootScope.$on("$stateChangeSuccess",(event, toState)  => {

        $rootScope.isLoading = false;


    });
    $rootScope.$on('$destroy', deregisterationCallback)
}
