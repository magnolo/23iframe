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
            this.$log.log(data);
            if (!this.countryExistsInData(data.feature.id)) return false;
            if (this.compare) {
                this.addCompareCountry(data.feature.id, true)
                this.showComparison();
            } else {
                $state.go('app.export.detail.chapter.indicator.country', {
                    indicator: this.ExportService.indicator.indicator_id,
                    indiname: this.ExportService.indicator.name,
                    iso: data.feature.id
                });
                //$rootScope.sidebarOpen = false;
                this.getCountryByIso(data.feature.id);
                this.fetchNationData(data.feature.id);
            }
        });
    }

    $onInit() {
        this.loadStateData();

        this.$scope.$watch('vm.selectedIndicator',
            (n, o) => {
                if (n === o || angular.isUndefined(n.id)) return false;
                if (angular.isDefined(o)) {
                    if (n.id == o.id) return false;
                }
                this.gotoIndicator();
            }
        );
    }
    countryExistsInData(iso) {
        var found = false;
        angular.forEach(this.data, (item)  => {
            if (item.iso == iso) {
                found = true;
            }
        });
        return found;
    }

    renderIndicator(item, callback) {
        this.IndicatorService.fetchIndicatorWithData(item.indicator_id,
            (indicator) => {
                this.data = indicator.data;
                this.structure = indicator;
                this.ExportService.data = indicator;
                this.circleOptions = {
                    color: this.ExportService.indicator.style.base_color || '#00ccaa',
                    field: 'rank',
                    size: this.structure.count,
                    hideNumbering: true,
                    width: 60,
                    height: 60,
                    fontSize: 12
                };
                this.MapService.setBaseLayer(item.style.basemap);
                this.MapService.setMapDefaults(item.style);
                this.MapService.setData(indicator.data, indicator, item.style.base_color, true);

                if (angular.isFunction(callback)) {
                    callback();
                }
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
                this.$rootScope.sidebarOpen = true;
            }
        );
    }

    getCountryByIso(iso) {
        angular.forEach(this.data,
            (item) => {
                if (item.iso == iso)
                    this.selectedCountry = item;
            }
        );
        return iso;
    }

    gotoIndicator() {
        if (this.ExportService.chapter.type == "indicator") {
            var idx = 0;
            angular.forEach(this.ExportService.exporter.items, (item, key) => {
                if (item.id == this.selectedIndicator.id) {
                    idx = key;
                }
            })
            if (angular.isDefined(this.selectedCountry.iso)) {
                this.$state.go('app.export.detail.chapter.indicator.country', {
                    chapter: idx + 1,
                    indicator: this.selectedIndicator.indicator_id,
                    indiname: this.selectedIndicator.name,
                    iso: this.selectedCountry.iso
                });
            } else {
                this.$state.go('app.export.detail.chapter.indicator', {
                    chapter: idx + 1,
                    indicator: this.selectedIndicator.indicator_id,
                    indiname: this.selectedIndicator.name
                });
            }
        } else {
            if (this.ExportService.chapter.id != this.selectedIndicator.parent.id) {
                var idx = 0;
                angular.forEach(this.ExportService.exporter.items, (item, key) => {
                    if (item.id == this.selectedIndicator.parent.id) {
                        idx = key;
                    }
                })
                if (angular.isDefined(this.selectedCountry.iso)) {
                    this.$state.go('app.export.detail.chapter.indicator.country', {
                        chapter: idx + 1,
                        indicator: this.selectedIndicator.indicator_id,
                        indiname: this.selectedIndicator.name,
                        iso: this.selectedCountry.iso
                    });
                } else {
                    this.$state.go('app.export.detail.chapter.indicator', {
                        chapter: idx + 1,
                        indicator: this.selectedIndicator.indicator_id,
                        indiname: this.selectedIndicator.name
                    });
                }
            } else {
                if (angular.isDefined(this.selectedCountry.iso)) {
                    this.$state.go('app.export.detail.chapter.indicator.country', {
                        indicator: this.selectedIndicator.indicator_id,
                        indiname: this.selectedIndicator.name,
                        iso: this.selectedCountry.iso
                    });
                } else {
                    this.$state.go('app.export.detail.chapter.indicator', {
                        indicator: this.selectedIndicator.indicator_id,
                        indiname: this.selectedIndicator.name
                    });
                }
                this.loadStateData();
            }
        }
    }

    addCompareCountry(iso, withRemove) {
        if (iso == this.selectedCountry.iso)
            return false;
        let cl = null;
        let idx = this.compareList.indexOf(iso);
        angular.forEach(this.data,
            (nat) => {
                if (nat.iso == iso)
                    cl = nat;
            }
        );
        if (idx == -1)
            if (cl) {
                this.countriesList.push(cl);
                this.compareList.push(cl.iso);
                this.MapService.setSelectedFeature(cl.iso, true);
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
        $state.go('app.export.detail.chapter.indicator.country.compare', {
            countries: this.compareList.join('-vs-')
        });
        this.MapService.gotoCountries($state.params.iso, this.compareList);
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
                                this.MapService.gotoCountries(this.$state.params.iso, this.compareList);
                            }
                        } else {
                            this.selectedCountry = {};
                        }
                        if (angular.isDefined(this.ExportService.chapter)) {
                            if (this.ExportService.chapter.description) {
                                this.showInfo();

                                this.$log.log("########################");
                                this.$log.log(this.ExportService.exporter);
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
