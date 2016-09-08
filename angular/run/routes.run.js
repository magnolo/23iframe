export function RoutesRun($log, $rootScope, $state, $timeout, MapService) {
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
        resetMapSize();
    });
    $rootScope.$on('$destroy', deregisterationCallback);

    var resetMapSize = () => {
      $timeout(() => {
        MapService.getMap().invalidateSize();
      }, 500);
    }
}
