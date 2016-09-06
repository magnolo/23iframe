export class IndicatorService{
    constructor(DataService){
        'ngInject';
        this.DataService = DataService;
    }

    fetchIndicatorWithData(id, success, query) {
        this.DataService.getOne('indicators/', id, query).then( (data) => {
            if (angular.isFunction(success)) {
                success(data);
            }
        });
    }
    
}

