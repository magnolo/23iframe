class ExportChooserController{
    constructor($scope, $timeout){
        'ngInject';

        this.$scope = $scope;
        this.$timeout = $timeout;

        this.index = 0;
        this.activeList = [];
        //
    }

    $onInit(){
        this.$timeout(
            () => {
                if (this.chapters) {
                    if (this.selected.parent_id)
                        angular.forEach(this.chapters,
                            (chapter) => {
                                if (chapter.id == this.selected.parent_id)
                                    this.activeList = chapter.children;
                            }
                        );
                    else
                        this.activeList = this.chapters;
                    this.index = this.activeList.indexOf(this.selected);
                }
            }
        );

        this.$scope.$watch('vm.index',
            (n, o) => {
                if (n === o) return false;
                this.selected = this.activeList[this.index];
            }
        );

    }

}

export const ExportChooserComponent = {
    templateUrl: './views/app/components/export-chooser/export-chooser.component.html',
    controller: ExportChooserController,
    controllerAs: 'vm',
    bindings: {
        countries: '=',
        nation: '=',
        selected: '=?',
        chapters: '=?',
        changed: '&',
        indicatorChange: '&?'
    }
}
