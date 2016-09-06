export class DataService{
    constructor(API){
        'ngInject';

        this.API = API;
    }

    getAll(route, filter) {
        return this.API.all(route).getList(filter);
    }

    getOne(route, id, query) {
        return this.API.one(route, id).get(query);
    }

}