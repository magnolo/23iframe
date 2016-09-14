export class MapService{
    constructor($log, $window, $timeout, DataService){
        'ngInject';

        this.$log = $log;
        this.$window = $window;
        this.$timeout = $timeout;
        this.DataService = DataService;

        this.fallbackBasemap = {
            name: 'Outdoor',
            url: '',
            type: 'xyz',
            layerOptions: {
                noWrap: true,
                continuousWorld: false,
                detectRetina: true
            }
        };

        this.basemap = this.fallbackBasemap;
        this.iso_field = 'iso_a2';
        //Ob canvas schon instatiert ist
        this.canvas = false;
        //Ist ein Farbverlauf anhand dessen die Farben selektiert werden um Polygone der Länder einzufärben
        this.palette = [];
        //Context der im Canvas erstellt wird, auf dem gezeichnet werden kann
        this.ctx = null;
        //API Keys
        this.keys = {
            mazpen: 'vector-tiles-Q3_Os5w',
            mapbox: 'pk.eyJ1IjoibWFnbm9sbyIsImEiOiJuSFdUYkg4In0.5HOykKk0pNP1N3isfPQGTQ'
        };
        //Configuration fuer den Datenzugriff allgemein
        this.data = {
            tileUrl: 'https://www.23degree.org:3001/services/postgis/tt_countries/geom/vector-tiles/{z}/{x}/{y}.pbf?fields=id,admin,adm0_a3,wb_a3,su_a3,iso_a3,iso_a2,name,name_long',
            layer: '',
            //Tabellenname in der die Laendershapes liegen
            name: 'tt_countries',
            //Tabellnamen für die subnational ebenen
            adm1: 'tt_adm1',
            adm2: 'tt_adm2',
            adm3: 'tt_adm3',
            //Default Farbe
            baseColor: '#06a99c',
            //ISO-3 Code Spalte
            iso3: 'adm0_a3',
            //ISO-2 Code Spalte
            iso2: 'iso_a2',
            //ISO Code der tatsaechlich verwendet wird
            iso: 'iso_a2',
            //Felder die aus der Datenbank angefordert werden auf die Landershapes bezogen
            fields: "id,admin,adm0_a3,wb_a3,su_a3,iso_a3,iso_a2,name,name_long",
            //Name des Feldes mit dem abgeglichen wird
            field: 'score'
        };
        // <DEPRECEATED>??
        this.map = {
            data: [],
            current: [],
            structure: [],
            style: [],
            attribution:''
        };
        // Object - Hier wird die LeafletMap abgespeichert
        this.mapLayer = null;
        // Object - Hier wird der Vektorlayer abgespeichert
        this.vectorLayer = new L.TileLayer.MVTSource({
            url: this.data.tileUrl,
            debug: false,
            detectRetina:true,
            clickableLayers: [this.getName() + '_geom'],
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
        this.labelsLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v4/magnolo.06029a9c/{z}/{x}/{y}.png?access_token=' + this.keys.mapbox, {
            noWrap: true,
            continuousWorld: false,
            name: 'labels',
            detectRetina: true
        });
        //Leaflet Configuration für automatisierte TileLayers
        this.layers = {
            baselayers: {
                xyz: this.basemap
            }
        };
        // Leaflet Config: Center
        this.center = {
            lat: 48.209206,
            lng: 16.372778,
            zoom: 3
        };
        //Leaflet Config: Grenzen
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
        //Leaflet Config: Default Einstellungen
        this.defaults = {
            minZoom: 2,
            maxZoom: 6,
            zoomControlPosition:'bottomright'
        };

        //Leaflet Config: Controls Settings
        this.controls  ={
          custom:[]
        }
        //Leafet Config: Lengende in der Map
        this.legend = {};

        //Define Custom Leaflet Controls
        this.customControls = {
          'labels':L.control(),
          'noLabels': true,
          'backHome': L.control(),
          backHomeClick: () => {}
        }

        var vm = this;
        this.countriesStyle = (feature) => {
            var style = {};
            var iso = feature.properties[vm.iso_field];
            var nation = vm.getNationByIso(iso);
            var field = 'score';
            var type = feature.type;
            feature.selected = false;
            switch (type) {
                case 3: //'Polygon'
                    if (angular.isDefined(nation[field]) && nation[field] != null) {
                        var linearScale = d3.scale.linear().domain([vm.map.structure.min, vm.map.structure.max]).range([0, 256]);

                        var colorPos = parseInt(linearScale(parseFloat(nation[field]))) * 4; //;
                        //var colorPos = parseInt(256 / 100 * parseInt(nation[field])) * 4;
                        var color = 'rgba(' + vm.palette[colorPos] + ', ' + vm.palette[colorPos + 1] + ', ' + vm.palette[colorPos + 2] + ',' + vm.palette[colorPos + 3] + ')';

                        style.color = 'rgba(' + vm.palette[colorPos] + ', ' + vm.palette[colorPos + 1] + ', ' + vm.palette[colorPos + 2] + ',0.6)'; //color;
                        style.outline = {
                            color: color,
                            size: 1
                        };
                        style.selected = {
                            color: 'rgba(' + vm.palette[colorPos] + ', ' + vm.palette[colorPos + 1] + ', ' + vm.palette[colorPos + 2] + ',0.3)',
                            outline: {
                                color: 'rgba(' + vm.palette[colorPos] + ', ' + vm.palette[colorPos + 1] + ', ' + vm.palette[colorPos + 2] + ',1)',
                                // color: 'rgba(66,66,66,0.9)',
                                size: 2
                            }
                        };

                    } else {
                        style.color = 'rgba(255,255,255,0)';
                        style.outline = {
                            color: 'rgba(255,255,255,0)',
                            size: 1
                        };

                    }
                    break;
            }
            return style;
        };
        this.invertedStyle = (feature) =>{
            var style = {};
            var iso = feature.properties[this.iso_field];
            var nation = this.getNationByIso(iso);
            // var field = this.map.structure.name || 'score';
            var field = 'score';

            var linearScale = d3.scale.linear().domain([this.map.structure.min, this.map.structure.max]).range([0, 256]);
            var colorPos = parseInt(linearScale(parseFloat(nation[field]))) * 4; //;
            var color = 'rgba(' + this.palette[colorPos] + ', ' + this.palette[colorPos + 1] + ', ' + this.palette[colorPos + 2] + ',' + this.palette[colorPos + 3] + ')';

            style.color = 'rgba(0,0,0,0)';
            if (angular.isDefined(nation[field]) && nation[field] != null) {
                style.color = 'rgba(' + this.palette[colorPos] + ', ' + this.palette[colorPos + 1] + ', ' + this.palette[colorPos + 2] + ',0.1)';
            }

            style.outline = {
                color: 'rgba(0,0,0,0)',
                size: 0
            };
            style.selected = {
                color: color,
                outline: {
                    color: 'rgba(0,0,0,0.3)',
                    size: 2
                }
            };
            return style;
        }
    }
    initVectorLayer(){
        this.mapLayer.addLayer(this.setLayer(this.vectorLayer));
    }

    //Initialize the Control for toggling the Labels Layer
    initLabelsControl(add){
      this.customControls.labels.setPosition('bottomright');
      this.customControls.labels.initialize = ()  => {
          L.Util.setOptions(this, options);
      }
      this.customControls.labels.onAdd = () => {
          var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control-zoom leaflet-toggle-label');
          var span = L.DomUtil.create('a', 'leaflet-control-zoom-in cursor', container);
          span.textContent = 'T';
          span.title = "Toggle Labels";
          L.DomEvent.disableClickPropagation(container);
          L.DomEvent.addListener(container, 'click', () => {
              var map = this.mapLayer();
              if (this.customControls.noLabels) {
                  this.mapLayer.removeLayer(this.labelsLayer);
                  that.customControls.noLabel = false;
              } else {
                  mapLayer.addLayer(this.labelsLayer);
                  this.labelsLayer.bringToFront();
                  this.customControls.noLabel = true;
              }
          });
          return container;
      }
      if(add)
        this.showLabelsControl(add);
    }

    initBackHomeControl(add){
      this.customControls.backHome.setPosition('bottomleft');
      this.customControls.backHome.initialize = function() {
          L.Util.setOptions(this, options);
      }
      this.customControls.backHome.onAdd = () => {
          var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control-zoom leaflet-control-home');
          var span = L.DomUtil.create('a', 'leaflet-control-zoom-in cursor', container);
          var icon = L.DomUtil.create('md-icon', 'material-icons md-primary', span);
          span.title = "Center Map";
          icon.textContent = "home";
          L.DomEvent.disableClickPropagation(container);
          L.DomEvent.addListener(container, 'click', this.customControls.backHomeClick);
          return container;
      }
      if(add)
        this.showBackHomeControl(add);
    }
    setBackHomeClick(clickFn){
      let container = this.customControls.backHome.getContainer();
      L.DomEvent.removeListener(container, 'click', this.customControls.backHomeClick);
      this.customControls.backHomeClick = clickFn
      L.DomEvent.addListener(container, 'click', this.customControls.backHomeClick);
    }
    // Add/Remove the Control for the Labels Layer on the Map
    showBackHomeControl(show){
      if(show){
        this.mapLayer.addControl(this.customControls.backHome);
      }
      else {
        this.mapLayer.removeControl(this.customControls.backHome);
      }
    }
    // Add/Remove the Control for the Labels Layer on the Map
    showLabelsControl(show){
      if(show){
        this.mapLayer.addControl(this.customControls.labels);
      }
      else {
        this.mapLayer.removeControl(this.customControls.labels);
      }
    }
    setMap(map) {
        return this.mapLayer = map;
    }

    getMap() {
        return this.mapLayer;
    }
    setView(lat, lng, zoom){
      let lt = lat || this.center.lat;
      let lg = lng || this.center.lng;
      let zo = zoom || this.center.zoom;
      this.mapLayer.setView([lt, lg], zo);
    }
    setBaseLayer(basemap, dataprovider) {

        if (!basemap) {
            this.basemap = basemap = this.fallbackBasemap;
        }
        var attribution = (basemap.attribution || basemap.provider);
        if(dataprovider){
          attribution += ' | Data by <a href="'+dataprovider.url+'" target="_blank">' + dataprovider.title + '</a>';
        }
        this.layers.baselayers['xyz'] = {
            name: basemap.name,
            url: basemap.url,
            type: 'xyz',
            // layerOptions: {
            //     noWrap: true,
            //     continuousWorld: false,
            //     detectRetina: true,
            //     // attribution:basemap.attribution || basemap.provider,
            //     attribution: "Copyright:© 2014 Esri, DeLorme, HERE, TomTom"
            // }
        }
        this.map.attribution = attribution;
        this.mapLayer.eachLayer((layer) => {
            if(layer.name == this.data.name+'_geom'){
              layer.bringToFront();
            }
        });

    }

    setMapDefaults(style) {
        this.defaults = {
            zoomControl: style.zoom_controls,
            scrollWheelZoom: style.scroll_wheel_zoom
        }
        if (style.scroll_wheel_zoom) {
            this.mapLayer.scrollWheelZoom.enable()
        } else {
            this.mapLayer.scrollWheelZoom.disable()
        }
        if (style.legends) {
          if(style.color_range){
  					this.legend = {
  						colors: [],
  						labels: []
  					}
  					if(typeof style.color_range == "string"){
  						style.color_range = JSON.parse(style.color_range);
  					}
  					angular.forEach(style.color_range, (color) => {
  						if(color.hasLabel){
  							this.legend.colors.push(color.color);
  							if(color.label){
  								this.legend.labels.push(color.label);
  							}
  							else{
  								this.legend.labels.push(parseFloat(color.stop*100).toFixed(0));
  							}
  						}
  					});
  					if(this.legend.colors.length == 0){
  						this.legend = null;
  					}
  				}
  				else{
  					this.legend = {
  						colors: ['#fff', style.base_color, 'rgba(102,102,102,1)'],
  						labels: ['high', 'Ø', 'low']
  					}
  				}
        } else {
            this.legend = null;
        }

    }

    resetBaseLayer() {
        this.layers.baselayers['xyz'] = this.baselayer;
    }
    resetMap(){
      this.mapLayer.eachLayer((layer) => {
        layer.setOpacity(0);
      });
      this.setBaseLayer();
      this.legend = null;
    }
    setLayer(l) {
        return this.data.layer = l;
    }
    setAdm1Layer(l) {
			return this.data.layerAdm1 = l;
		}

    getLayer() {
      return this.data.layer;
    }
    getAdm1(){
			return this.data.adm1;
		}

    getName() {
        return this.data.name;
    }

    fields() {
        return this.data.fields;
    }

    iso() {
        return this.data.iso;
    }

    iso3() {
        return this.data.iso3;
    }

    iso2() {
        return this.data.iso2;
    }

    createCanvas(color) {
      console.log(color)
        //Erstellt canvas DOM-Element
        this.canvas = this.$window.document.createElement('canvas');
        //Dimensionen des canvas elements
        this.canvas.width = 257;
        this.canvas.height = 10;
        //2d Context auf dem gemalt werden kann
        this.ctx = this.canvas.getContext('2d');
        //Erstellt Gradient, noch nicht gezeichnet
        var gradient = this.ctx.createLinearGradient(0, 0, 257, 10);
        //Legt Position und Farbwert im Gradient fest
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,0.6)');
        gradient.addColorStop(0, 'rgba(102,102,102,0.6)');
        //Zeichnet Gradient in 2d context
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, 257, 10);
        //Liste der RGB(vllt A) Daten die in den Gradient gezeichnet wurden
        this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
        //document.getElementsByTagName('body')[0].appendChild(this.canvas);
    }

    updateCanvas(color) {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var gradient = this.ctx.createLinearGradient(0, 0, 257, 10);
        gradient.addColorStop(1, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.53, color || 'rgba(128, 243, 198,1)');
        gradient.addColorStop(0, 'rgba(102,102,102,1)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, 257, 10);
        this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
        //document.getElementsByTagName('body')[0].appendChild(this.canvas);
    }

    createFixedCanvas(colorRange) {

        this.canvas = this.$window.document.createElement('canvas');
        this.canvas.width = 280;
        this.canvas.height = 10;
        this.ctx = this.canvas.getContext('2d');
        var gradient = this.ctx.createLinearGradient(0, 0, 257, 10);

        for (var i = 0; i < colorRange.length; i++) {
  				gradient.addColorStop(colorRange[i].stop, colorRange[i].color);
  			}
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, 257, 10);
        this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
        //document.getElementsByTagName('body')[0].appendChild(this.canvas);
    }

    updateFixedCanvas(colorRange) {
        var gradient = this.ctx.createLinearGradient(0, 0, 257, 10);
        for (var i = 0; i < colorRange.length; i++) {
          gradient.addColorStop(colorRange[i].stop, colorRange[i].color);
        }
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, 257, 10);
        this.palette = this.ctx.getImageData(0, 0, 257, 1).data;
        //document.getElementsByTagName('body')[0].appendChild(this.canvas);
    }
    parseColorRange(range){
      if(!range) return range;
      if(range.indexOf('\\') > -1){
        range = this.parseColorRange(JSON.parse(range));
      }
      if(typeof range === "string"){
        range = this.parseColorRange(JSON.parse(range));
      }
      return range;
    }
    setBaseColor(color) {
        return this.data.baseColor = color;
    }

    countryClick(clickFunction) {
        this.$timeout(
            () => {
                this.data.layer.options.onClick = clickFunction;
            }
        );
    }

    getColor(value) {
        return this.palette[value];
    }

    setStyle(style) {
        return this.map.style = style;
    }

    invertStyle() {
        this.data.layer.setStyle(this.invertedStyle);
        this.data.layer.options.mutexToggle = false;
        this.data.layer.redraw();
    }

    localStyle() {
        this.data.layer.setStyle(this.countriesStyle);
        this.data.layer.options.mutexToggle = true;
        this.data.layer.redraw();
    }

    setData(data, structure, color, drawIt) {
        this.map.data = data;
        this.map.structure = structure;

        if (angular.isDefined(color)) {
            this.data.baseColor = color;
        }
        if (!this.canvas) {
            if (typeof this.data.baseColor == 'string') {
                this.createCanvas(this.data.baseColor);
            } else {
                this.createFixedCanvas(this.data.baseColor);
            }
        } else {
            if (typeof this.data.baseColor == 'string') {
                this.updateCanvas(this.data.baseColor);
            } else {
                this.updateFixedCanvas(this.data.baseColor);
            }
        }
        if (drawIt) {
            this.paintCountries();
        }
        this.mapLayer.eachLayer((layer) => {
          layer.setOpacity(1);
        });


    }

    getNationByIso(iso, list) {
        var nation = {};

        if (angular.isDefined(list)) {
            if (list.length == 0) return false;
            angular.forEach(list,
                (nat) => {
                    if (nat.iso == iso) {
                        nation = nat;
                    }
                }
            );
        } else {
            if (this.map.data.length == 0) return false;
            angular.forEach(this.map.data,
                (nat) => {
                    if (nat.iso == iso) {
                        nation = nat;
                    }
                }
            );
        }
        return nation;
    }

    paintCountries(style, click) {
      //  this.data.layer.setOpacity(0);
        this.$timeout(
            () => {
                if (angular.isDefined(style) && style != null) {
                    this.data.layer.setStyle(style);
                } else {
                    //this.data.layer.setStyle(this.map.style);
                    this.data.layer.setStyle(this.countriesStyle);
                }
                if (angular.isDefined(click)) {
                    this.data.layer.options.onClick = click;
                }
                this.data.layer.redraw();
              //  this.data.layer.setOpacity(0.2);
            }
        );
    }

    resetSelected(iso) {
        if (angular.isDefined(this.data.layer.layers)) {
            angular.forEach(this.data.layer.layers[this.data.name + '_geom'].features,
                (feature, key) => {
                    if (iso) {
                        if (key != iso)
                            feature.selected = false;
                    } else {
                        feature.selected = false;
                    }
                }
            );
            this.redraw();
        }
    }

    setSelectedFeature(iso, selected, deselectAll) {
        //Wenn das angeklickte Feature der Map keinen Iso-Wert enthält, soll nichts passieren
        if (angular.isUndefined(this.data.layer.layers[this.data.name + '_geom'].features[iso])) {
            this.$log.log(iso);
            //debugger;
        } else {
            if(deselectAll){
                angular.forEach(this.data.layer.layers[this.data.name + '_geom'].features,
                    (feature) => {
                        feature.selected = false;
                    }
                );
            }

            this.data.layer.layers[this.data.name + '_geom'].features[iso].selected = selected;
            this.redraw();
        }
    }

    redraw() {
        this.data.layer.redraw();
    }

    paint(color) {
      if(typeof color == "string"){
        this.setBaseColor(color);
        if (this.ctx) {
            this.updateCanvas(color);
        } else {
            this.createCanvas(color)
        }
      }
      else{
        if (this.ctx) {
					this.updateFixedCanvas(color);
				} else {
					this.createFixedCanvas(color)
				}
      }
      this.paintCountries();
    }

    gotoCountry(iso) {
        this.DataService.getOne('countries/bbox', [iso]).then(
            (data) => {
                var southWest = L.latLng(data.coordinates[0][0][1], data.coordinates[0][0][0]),
                    northEast = L.latLng(data.coordinates[0][2][1], data.coordinates[0][2][0]),
                    bounds = L.latLngBounds(southWest, northEast);

                var pad = [
                    [0, 0],
                    [100, 100]
                ];
                this.mapLayer.fitBounds(bounds, {
                    padding: pad[1],
                    maxZoom: 4
                });
            }
        );
    }

    gotoCountries(main, isos) {
        //	isos.push(main);

        this.DataService.getOne('countries/bbox', isos).then(
            (data) => {
                var southWest = L.latLng(data.coordinates[0][0][1], data.coordinates[0][0][0]),
                    northEast = L.latLng(data.coordinates[0][2][1], data.coordinates[0][2][0]),
                    bounds = L.latLngBounds(southWest, northEast);

                var pad = [
                    [100, 100],
                    [100, 100]
                ];
                this.mapLayer.fitBounds(bounds, {
                    padding: pad[1],
                    maxZoom: 4
                });
            }
        );
    }



}
