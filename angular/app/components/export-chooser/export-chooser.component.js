class ExportChooserController{
    constructor(ExportService,$state){
        'ngInject';

        this.$state = $state;
        this.ExportService = ExportService;
        //
    }

    $onInit(){

    }
    gotoIndicator() {
        if (this.ExportService.chapter.type == "indicator") {
            var idx = 0;
            angular.forEach(this.ExportService.exporter.items, (item, key) => {
                if (item.id == this.ExportService.indicator.id) {
                    idx = key;
                }
            })
            if (angular.isDefined(this.$state.params.iso)) {
                this.$state.go('app.export.detail.chapter.indicator.country', {
                    chapter: idx + 1,
                    indicator: this.ExportService.indicator.indicator_id,
                    indiname: this.ExportService.indicator.name,
                    iso: this.$state.params.iso
                });
            } else {
                this.$state.go('app.export.detail.chapter.indicator', {
                    chapter: idx + 1,
                    indicator: this.ExportService.indicator.indicator_id,
                    indiname: this.ExportService.indicator.name
                });
            }
        } else {
            if (this.ExportService.chapter.id != this.ExportService.indicator.parent.id) {
                var idx = 0;
                angular.forEach(this.ExportService.exporter.items, (item, key) => {
                    if (item.id == this.ExportService.indicator.parent.id) {
                        idx = key;
                    }
                })
                if (angular.isDefined(this.$state.params.iso)) {
                    this.$state.go('app.export.detail.chapter.indicator.country', {
                        chapter: idx + 1,
                        indicator: this.ExportService.indicator.indicator_id,
                        indiname: this.ExportService.indicator.name,
                        iso: this.$state.params.iso
                    });
                } else {
                    this.$state.go('app.export.detail.chapter.indicator', {
                        chapter: idx + 1,
                        indicator: this.ExportService.indicator.indicator_id,
                        indiname: this.ExportService.indicator.name
                    });
                }
            } else {
                if (angular.isDefined(this.$state.params.iso)) {
                    this.$state.go('app.export.detail.chapter.indicator.country', {
                        indicator: this.ExportService.indicator.indicator_id,
                        indiname: this.ExportService.indicator.name,
                        iso: this.selectedCountry.iso
                    });
                } else {
                    this.$state.go('app.export.detail.chapter.indicator', {
                        indicator: this.ExportService.indicator.indicator_id,
                        indiname: this.ExportService.indicator.name
                    });
                }

            }
        }
    }

}

export const ExportChooserComponent = {
    templateUrl: './views/app/components/export-chooser/export-chooser.component.html',
    controller: ExportChooserController,
    controllerAs: 'vm',
    bindings: {  }
}
