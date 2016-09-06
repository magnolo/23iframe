export function NewlineFilter(){
    'ngInject';

    return function( input ){
        return input.replace(/(\\r)?\\n/g, '<br /><br />');
    }
}
