class CountryChooserController{
    constructor(){
        'ngInject';

        //
        this.index = 0;
        this.activeList = [];
    }

    $onInit(){
        // this.$timeout(
        //     () => {
                if (this.chapters) {
                  if(angular.isDefined(this.selected)){
                    if (this.selected.parent_id)
                        angular.forEach(this.chapters,
                            (chapter) => {
                                if (chapter.id == this.selected.parent_id)
                                    this.activeList = chapter.children;
                            }
                        );
                    else{
                        this.activeList = this.chapters;
                    }
                    this.index = this.activeList.indexOf(this.selected);
                  }

                }
        //     }
        // );
    }

}

export const CountryChooserComponent = {
    templateUrl: './views/app/components/country-chooser/country-chooser.component.html',
    controller: CountryChooserController,
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
