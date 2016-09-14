class MapController{
    constructor(leafletData, MapService){
        'ngInject';

        this.leafletData = leafletData;
        this.MapService = MapService;
    }

    $onInit(){
        this.leafletData.getMap().then((map) => {
            this.MapService.setMap(map);
            this.MapService.initVectorLayer();
            this.MapService.initLabelsControl();
            this.MapService.initBackHomeControl(true);
        });

    }
}

export const MapComponent = {
    templateUrl: './views/app/components/map/map.component.html',
    controller: MapController,
    controllerAs: 'vm',
    bindings: {}
}
