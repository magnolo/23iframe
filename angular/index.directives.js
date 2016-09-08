import {CompareCountriesDirective} from './directives/compare-countries/compare-countries.directive';
import {MedianDirective} from './directives/median/median.directive';
import {CirclegraphDirective} from './directives/circlegraph/circlegraph.directive';

angular.module('app.directives')
	.directive('compareCountries', CompareCountriesDirective)
	.directive('median', MedianDirective)
	.directive('circlegraph', CirclegraphDirective)
