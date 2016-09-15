class ChapterContentController {
    constructor(
        $scope, $rootScope, $timeout, $state, $log,
        DataService, IndicatorService, IndexService, DialogService,
        ExportService, MapService) {
        'ngInject';

        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.$state = $state;
        this.$log = $log;
        this.DataService = DataService;
        this.IndicatorService = IndicatorService;
        this.IndexService = IndexService;
        this.DialogService = DialogService;
        this.ExportService = ExportService;
        this.MapService = MapService;
        this.countries;

        this.compare = false;
        this.activeTab = 0;

        this.selectedCountry = {};
        this.current = {};
        this.circleOptions = {};

        this.countriesList = [];
        this.compareList = [];

        this.chapterId = this.$state.params.chapter;


        //
        this.MapService.countryClick((data) => {
            this.gotoCountry(data.feature.id);
        });
        $timeout(() => {
            this.MapService.setBackHomeClick(() => {
              this.$rootScope.countrySelected = false;
              this.selectedCountry = {};
              this.current = {};
              this.countriesList = [];
              this.compareList = [];
              this.MapService.resetSelected();
              this.MapService.setView();
              this.$state.go('app.export.detail.chapter', {
                chapter: 1
              });
            });
        });

    }

    $onInit() {
        this.loadStateData();
    }
    gotoCountry(iso) {
        if (!this.countryExistsInData(iso)) return false;
        if (this.compare) {
            this.addCompareCountry(iso, true)
            this.showComparison();
        } else {
            this.$state.go('app.export.detail.chapter.indicator.country', {
                indicator: this.ExportService.indicator.indicator_id,
                indiname: this.ExportService.indicator.name,
                iso: iso
            });
            this.getCountryByIso(iso);
            this.fetchNationData(iso);

        }
    }

    countryExistsInData(iso) {
        var found = false;
        angular.forEach(this.ExportService.data.data, (item) => {
            if (item.iso == iso) {
                found = true;
            }
        });
        return found;
    }

    renderIndicator(item, callback) {
        this.MapService.resetMap();
        this.$rootScope.isLoading = true;
        this.IndicatorService.fetchIndicatorWithData(item.indicator_id,
            (indicator) => {
                this.ExportService.data = indicator;
                this.circleOptions = {
                    color: this.ExportService.indicator.style.base_color || '#00ccaa',
                    field: 'rank',
                    size: this.ExportService.data.count,
                    hideNumbering: true,
                    width: 60,
                    height: 60,
                    fontSize: 12
                };
                this.compareOptions = {
                    field: 'score',
                    height: 25,
                    margin: 5,
                    color: this.ExportService.indicator.style.base_color,
                    duration: 500,
                    min: this.ExportService.data.min,
                    max: this.ExportService.data.max
                }
                item.style.color_range = this.MapService.parseColorRange(item.style.color_range);
                this.MapService.setBaseLayer(item.style.basemap);
                this.MapService.setMapDefaults(item.style);
                this.MapService.setData(indicator.data, indicator, item.style.color_range ||  item.style.base_color, true);

                if (angular.isFunction(callback)) {
                    callback();
                }
                this.$rootScope.isLoading = false;
            }, {
                data: true
            }
        );
    }

    getIndicator(callback) {
        this.ExportService.getIndicator(this.$state.params.id, this.$state.params.chapter, this.$state.params.indicator, (indicator, chapter, exporter) => {
            this.selectedIndicator = indicator;
            this.renderIndicator(indicator, callback);
        });
    }

    fetchNationData(iso) {
        if (!this.$state.params.countries) {
            this.MapService.gotoCountry(iso);
        }

        this.IndexService.fetchNationData(this.ExportService.indicator.indicator_id, iso,
            (data) => {
                this.current = data;
                this.MapService.setSelectedFeature(iso, true, true);
            }
        );
    }

    getCountryByIso(iso) {
        angular.forEach(this.ExportService.data.data,
            (item) => {
                if (item.iso == iso)
                    this.selectedCountry = item;
            }
        );
        this.$rootScope.countrySelected = true;
        return iso;
    }


    setCompare(activate) {
        if (activate) {
            this.compare = true;
            this.countriesList[0] = this.selectedCountry;
            this.MapService.invertStyle();
            this.$state.go('app.export.detail.chapter.indicator.country.compare', {
                countries: this.compareList.join('-vs-')
            });
        } else {
            this.compare = false;
            this.MapService.localStyle();
            this.$state.go('app.export.detail.chapter.indicator.country');
            this.MapService.setSelectedFeature(this.$state.params.iso, true);

            //muss nicht sein
            this.compareList = [];
            this.countriesList = [];
        }

    }
    addCompareCountry(iso, withRemove) {
        if (iso == this.selectedCountry.iso)
            return false;
        let cl = null;
        let idx = this.compareList.indexOf(iso);
        angular.forEach(this.ExportService.data.data,
            (nat) => {
                if (nat.iso == iso)
                    cl = nat;
            }
        );
        if (idx == -1) {
            if (cl) {
                this.countriesList.push(cl);
                this.compareList.push(cl.iso);
                this.MapService.setSelectedFeature(cl.iso, true);
            }
        } else if (withRemove) {
            this.compareList.splice(idx, 1);
            this.countriesList.splice(this.countriesList.indexOf(cl), 1);
            this.MapService.setSelectedFeature(iso, false);
        }

    }

    showInfo() {
        this.DialogService.fromTemplate('export', this.$scope);
    }
    showComparison() {
        this.$state.go('app.export.detail.chapter.indicator.country.compare', {
            countries: this.compareList.join('-vs-')
        });
        this.MapService.gotoCountries(this.$state.params.iso, this.compareList);
    }

    loadStateData() {
        this.$timeout(
            //RESET COUNTRY FOR CORRECT VIEW, IF NOT: View would stay active
            () => {
                this.selectedCountry = {};
                this.getIndicator(
                    () => {
                        if (this.$state.params.iso) {
                            this.getCountryByIso(this.$state.params.iso);
                            this.fetchNationData(this.$state.params.iso);

                            if (this.$state.params.countries) {

                                var countries = this.$state.params.countries.split('-vs-');
                                angular.forEach(countries, (country) => {
                                    this.addCompareCountry(country);
                                });
                                this.activeTab = 2;
                                this.showComparison();
                            }
                        } else {
                            this.selectedCountry = {};
                        }
                        if (angular.isDefined(this.ExportService.chapter)) {
                            if (this.ExportService.chapter.description) {
                                this.showInfo();
                            }
                        }
                    }
                );
            }
        );
    }
}

export const ChapterContentComponent = {
    templateUrl: './views/app/components/chapter-content/chapter-content.component.html',
    controller: ChapterContentController,
    controllerAs: 'vm',
    bindings: {}
}
