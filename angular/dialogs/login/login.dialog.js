export class LoginController{
    constructor(DialogService){
        'ngInject';

        this.DialogService = DialogService;
    }

    save(){
        //
    }

    hide(){
        this.DialogService.hide();
    }
}

