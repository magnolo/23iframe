class CoverController{
    constructor($log, $rootScope, $state, ExportService){
        'ngInject';
        this.ExportService = ExportService;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$log = $log;
        //
    }

    $onInit(){
        this.ExportService.getExport(this.$state.params.id, function(exporter){});
        this.$rootScope.sidebarOpen = false;
        this.$log.log(this.$rootScope.isViewer);
    }
}

export const CoverComponent = {
    templateUrl: './views/app/components/cover/cover.component.html',
    controller: CoverController,
    controllerAs: 'vm',
    bindings: {}
}
