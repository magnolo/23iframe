export class ExportController{
    constructor($log, ExportService, DialogService){
        'ngInject';

        this.DialogService = DialogService;
        this.ExportService = ExportService;
        this.$log = $log;
        this.$log.log('TER');
    }

    save(){
        this.DialogService.hide();

    }

    hide(){
        this.$log.log("xxxxxxxxxxx");
        this.$log.log(this.ExportService.chapter.title);
        this.DialogService.hide();
    }
}

