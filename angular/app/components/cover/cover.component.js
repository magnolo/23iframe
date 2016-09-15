class CoverController{
    constructor(ExportService){
        'ngInject';
        this.ExportService = ExportService;
    }

    $onInit(){
        this.ExportService.getExport(this.$state.params.id);
    }
}

export const CoverComponent = {
    templateUrl: './views/app/components/cover/cover.component.html',
    controller: CoverController,
    controllerAs: 'vm',
    bindings: {}
}
