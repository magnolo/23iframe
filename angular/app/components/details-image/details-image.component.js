class DetailsImageController{
    constructor(){
        'ngInject';

        //
    }

    $onInit(){
    }
}

export const DetailsImageComponent = {
    templateUrl: './views/app/components/details-image/details-image.component.html',
    controller: DetailsImageController,
    controllerAs: 'vm',
    bindings: {
        isDark:'<',
        imageSrc:'<'
    }
}
