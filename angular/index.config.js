import {GlobalsConfig} from './config/globals.config';
import {RoutesConfig} from './config/routes.config';
import {LoadingBarConfig} from './config/loading_bar.config';
import {ThemeConfig} from './config/theme.config';

angular.module('app.config')
	.config(GlobalsConfig)
  .config(RoutesConfig)
	.config(LoadingBarConfig)
	.config(ThemeConfig);
