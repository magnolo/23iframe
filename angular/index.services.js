import {IndexService} from './services/index.service';
import {IndicatorService} from './services/indicator.service';
import {D3Service} from './services/d3.service';
import {MapService} from './services/map.service';
import {ExportService} from './services/export.service';
import {DataService} from './services/data.service';
import {APIService} from './services/API.service';
import {DialogService} from './services/dialog.service';
import {ToastService} from './services/toast.service';

angular.module('app.services')
	.service('IndexService', IndexService)
	.service('IndicatorService', IndicatorService)
	.service('D3Service', D3Service)
	.service('MapService', MapService)
	.service('ExportService', ExportService)
	.service('DataService', DataService)
	.service('API', APIService)
	.service('DialogService', DialogService)
	.service('ToastService', ToastService)
