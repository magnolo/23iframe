class ChapterHeaderController{
    constructor($rootScope, $scope, $state, $mdSidenav, DialogService, ExportService){
        'ngInject';

        //
        this.ExportService = ExportService;
        this.DialogService = DialogService;
        this.$state = $state;
        this.$mdSidenav = $mdSidenav;
    }

    $onInit(){
    }
    gotoChapter(chapter){
      this.ExportService.getChapter(this.$state.params.id, chapter, (c, i) => {

				if (this.$state.params.iso) {
					this.$state.go('app.export.detail.chapter.indicator.country', {
						chapter: chapter,
						indicator: i.indicator_id,
						indiname: i.name,
						iso: this.$state.params.iso
					});
				} else {
					this.$state.go('app.export.detail.chapter.indicator', {
						chapter: chapter,
						indicator: i.indicator_id,
						indiname: i.name
					})
				}

			});
    }
    showData(){
      this.$mdSidenav('right')
                .toggle();
    }
}

export const ChapterHeaderComponent = {
    templateUrl: './views/app/components/chapter-header/chapter-header.component.html',
    controller: ChapterHeaderController,
    controllerAs: 'vm',
    bindings: {}
}
