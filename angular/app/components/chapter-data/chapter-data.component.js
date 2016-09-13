class ChapterDataController{
    constructor(ExportService,$mdSidenav){
        'ngInject';

        this.$mdSidenav  = $mdSidenav;
        this.ExportService = ExportService;
    }
    closeRightbar(){
      this.$mdSidenav('right')
                .toggle();
    }
    $onInit(){
    }
}

export const ChapterDataComponent = {
    templateUrl: './views/app/components/chapter-data/chapter-data.component.html',
    controller: ChapterDataController,
    controllerAs: 'vm',
    bindings: {}
}
