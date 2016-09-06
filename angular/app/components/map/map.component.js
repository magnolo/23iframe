class MapController{
    constructor($rootScope, $state, leafletData, $log, leafletMapEvents, MapService){
        'ngInject';

        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.leafletData = leafletData;

        var apiKey = MapService.keys.mapbox;
        this.MapService = MapService;
        this.labelsLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v4/magnolo.06029a9c/{z}/{x}/{y}.png?access_token=' + apiKey, {
            noWrap: true,
            continuousWorld: false,
            name: 'labels',
            detectRetina: true
        });
        this.maxbounds = {
            southWest: {
                lat: 90,
                lng: 180
            },
            northEast: {
                lat: -90,
                lng: -180
            }
        };
        this.controls = {
            custom: []
        };
        this.layercontrol = {
            icons: {
                uncheck: "fa fa-toggle-off",
                check: "fa fa-toggle-on"
            }
        }
    }

    $onInit(){
        var MapService = this.MapService;
        var $state = this.$state;
        var MyControl = L.control();
        MyControl.setPosition('bottomright');
        MyControl.initialize = function() {
            L.Util.setOptions(this, options);
        }

        var that = this;

        MyControl.onAdd = function() {

            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control-zoom leaflet-toggle-label');
            var span = L.DomUtil.create('a', 'leaflet-control-zoom-in cursor', container);
            span.textContent = 'T';
            span.title = "Toggle Labels";
            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.addListener(container, 'click', function() {
                var map = MapService.getMap();

                if (that.noLabel) {
                    map.removeLayer(that.labelsLayer);
                    that.noLabel = false;
                } else {
                    map.addLayer(that.labelsLayer);
                    that.labelsLayer.bringToFront();
                    that.noLabel = true;
                }

            });
            return container;
        }
        var BackHome = L.control();
        BackHome.setPosition('bottomleft');
        BackHome.initialize = function() {
            L.Util.setOptions(this, options);
        }
        BackHome.onAdd = function() {
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control-zoom leaflet-control-home');
            var span = L.DomUtil.create('a', 'leaflet-control-zoom-in cursor', container);
            var icon = L.DomUtil.create('md-icon', 'material-icons md-primary', span);
            span.title = "Center Map";
            icon.textContent = "home";
            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.addListener(container, 'click', function() {
                var map = MapService.getMap();
                map.setView([48.209206, 16.372778], 2);

                if($state.$current.name.indexOf('app.export.detail.chapter.indicator') > -1){
                    $state.go('app.export.detail.chapter.indicator',{
                        id: $state.params.id,
                        name: $state.params.name,
                        chapter: $state.params.chapter,
                        indicator: $state.params.indicator,
                        indiname:$state.params.indiname
                    },{
                        reload:true
                    });
                    this.$rootScope.sidebarOpen = false;
                }
            });
            return container;
        }

        this.leafletData.getMap().then(function(map) {
            MapService.setMap(map);
            //var url = 'http://v22015052835825358.yourvserver.net:3001/services/postgis/' + this.MapService.getName() + '/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=' + this.MapService.fields(); //
            var url = 'https://www.23degree.org:3001/services/postgis/' + MapService.getName() + '/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=' + MapService.fields(); //

            var layer = new L.TileLayer.MVTSource({
                url: url,
                debug: false,
                detectRetina:true,
                clickableLayers: [MapService.getName() + '_geom'],
                mutexToggle: true,
                getIDForLayerFeature: (feature) =>  {
                    return feature.properties.iso_a2;
                },
                filter: (feature, context) => {

                    return true;
                },
                style: (feature) => {
                    var style = {};
                    style.color = 'rgba(0,0,0,0)';
                    style.outline = {
                        color: 'rgba(0,0,0,0)',
                        size: 0
                    };
                    return style;
                }
            });
            map.addLayer(MapService.setLayer(layer));
            map.addControl(MyControl);
            map.addControl(BackHome);

        });

    }

    toggleLayers(overlayName) {
        var map = this.MapService.getMap('map');
        if (this.noLabel) {
            map.removeLayer(this.labelsLayer);
            this.noLabel = false;
        } else {
            map.addLayer(this.labelsLayer);
            this.labelsLayer.bringToFront();
            this.noLabel = true;
        }


    }

}

export const MapComponent = {
    templateUrl: './views/app/components/map/map.component.html',
    controller: MapController,
    controllerAs: 'vm',
    bindings: {}
}
