export class IndexService{
    constructor(DataService){
        'ngInject';

        this.DataService = DataService;
    }

    fetchNationData(indicator, iso, success) {
        return this.DataService.getOne('indicators/' + indicator + "/history", iso).then( (data) => {
            success(data);
        });
    }

}

