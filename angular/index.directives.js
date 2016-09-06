import {MedianDirective} from './directives/median/median.directive';
import {CirclegraphDirective} from './directives/circlegraph/circlegraph.directive';

angular.module('app.directives')
	.directive('median', MedianDirective)
	.directive('circlegraph', CirclegraphDirective)
