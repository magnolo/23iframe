class CountryChooserController{
    constructor(){
        'ngInject';

        //
    }

    $onInit(){
    }
    changed(nation){
      console.log('changed');
    }
}

export const CountryChooserComponent = {
    templateUrl: './views/app/components/country-chooser/country-chooser.component.html',
    controller: CountryChooserController,
    controllerAs: 'vm',
    bindings: {
      changed:'&'
    }
}
