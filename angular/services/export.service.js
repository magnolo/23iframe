export class ExportService{
    constructor(DataService, $log){
        'ngInject';

        this.DataService = DataService;
        this._promise, this._promiseOne;
        this._callbacks = new Array();
        this._callbacksOne = new Array();
        this.exports;
        this.chapter;
        this.indicator;
        this.$log = $log;
        this.exporter = {};
    }

    getExports(success, error, force) {
        if (angular.isDefined(this.exports) && !force) {
            if (angular.isFunction(success))
                success(this.exports);
        } else if (angular.isDefined(this._promise) && !force) {
            if (angular.isFunction(success))
                this._callbacks.push(success);
        } else {
            this._callbacks.push(success);
            this._promise = this.DataService.getAll('exports').then( (response) => {
                this.exports = response;
                angular.forEach(this._callbacks, (callback) => {
                    if (angular.isDefined(callback))
                        callback(this.exports);
                });
                this._promise = null;
            }, error);
        }
    }

    getExport(id, success, error, force) {

        if (angular.isDefined(this.exporter) && this.exporter.id == id && !force) {
            if (angular.isFunction(success))
                success(this.exporter);
        } else {
            this._callbacksOne.push(success);
            this._promiseOne = this.DataService.getOne('exports', id).then( (response) => {
                this.exporter = response;
                if (!this.exporter.items) {
                    this.exporter.items = new Array();
                }
                angular.forEach(this._callbacksOne, (callback) => {
                    if (angular.isDefined(callback))
                        callback(this.exporter);
                });
                this._promiseOne = null;
            }, error);
        }
    }

    getChapter(id, chapter, success, ignoreFirst) {
        if (angular.isDefined(this.exporter) && this.exporter.id == id) {
            this.chapter = this.exporter.items[chapter - 1];

            if (!ignoreFirst) {
                if (this.chapter.type == "indicator") {
                    this.indicator = this.chapter;
                } else {
                    this.indicator = this.getFirstIndicator(this.chapter.children);
                }
            }

            if (angular.isFunction(success))
                success(this.chapter, this.indicator);
        } else {
            this.getExport(id, () => {
                this.chapter = this.exporter.items[chapter - 1];
                if (!ignoreFirst)
                    this.indicator = this.getFirstIndicator(this.chapter.children);
                if (angular.isFunction(success))
                    success(this.chapter, this.indicator);
            });
        }
    }

    getIndicator(id, chapter, indicator, success) {
        var fetch = angular.isUndefined(indicator) ? true : false;

        this.getExport(id, () => {
            this.getChapter(id, chapter, () => {
                if (!fetch) this.indicator = this.findIndicator(indicator);
                success(this.indicator, this.chapter, this.exporter);
            }, !fetch)
        });
    }

    getFirstIndicator(list) {
        var found = null;
        angular.forEach(list, (item) => {
            if (item.type == 'indicator' && !found) {
                found = item;
            } else {
                if (!found) {
                    found = this.getFirstIndicator(item.children);
                }
            }
        });
        return found;
    }
    
    findIndicator(indicator_id) {
        var item = null;
        angular.forEach(this.exporter.items, (chapter) => {
            if (angular.isDefined(chapter.indicator_id)) {
                if (chapter.indicator_id == indicator_id) {
                    item = chapter;
                }
            }
            angular.forEach(chapter.children, (indicator) => {
                if (indicator.indicator_id == indicator_id) {
                    item = indicator;
                }
            })
        });
        return item;
    }

}

