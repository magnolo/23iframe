class DetailsItemChooserController{
    constructor($log, ExporterService){
        'ngInject';
        this.$log = $log;
        this.ExporterService = ExporterService;
        //
    }

    $onInit(){
        //TODO Check if items has children, rearrange to fit ng-repeat in template
/*
        if (!(this.items[0].type == 'group')) {
            this.items[0].children = _.cloneDeep(this.items);
        }*/

    }

    $onChanges() {
        this.items = this.ExporterService.exporter.items;
    }

}

export const DetailsItemChooserComponent = {
    templateUrl: './views/app/components/details-item-chooser/details-item-chooser.component.html',
    controller: DetailsItemChooserController,
    controllerAs: 'vm',
    bindings: {
        items:'@',
        selectedItem:'&',
        baseColor:'@',
        onChange: '&changeFunction'
    }
}
