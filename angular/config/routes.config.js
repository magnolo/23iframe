export function RoutesConfig($stateProvider, $urlRouterProvider) {
	'ngInject';

	let getView = (viewName) => {
		return `./views/app/pages/${viewName}/${viewName}.page.html`;
	};

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('app', {
			abstract: true,
            data: {},//{auth: true} would require JWT auth
			views: {
				header: {
					templateUrl: getView('header')
				},
				main: {},
                'map@': {
                    templateUrl: getView('test-view')
                }
			}
		})
		.state('app.landing', {
            url: '/',
            views: {
                'main@': {
                    templateUrl: getView('test-view')
                }
            }
        })
        .state('app.export', {
            abstract: true,
            url: '/export',
            resolve: {
                countries: (DataService) => {
                    return DataService.getOne('countries/isos').then((countries) => {
                        return countries;
                    });
                }
            }
        })
        .state('app.export.detail', {
            url: '/:id/:name',
            data: {
                pageName: 'Export Data'
            },
            views: {
                'fullscreen@': {
                    templateUrl: getView('cover')
                }
            }
        })
        .state('app.export.detail.chapter', {
            url: '/chapter/:chapter',
            data: {
                pageName: 'Export Data'
            },
            views: {
                'header@': {
                    templateUrl: getView('header')
                },
                'sidebar@': {
                    templateUrl: getView('chapterContent')
                },
                'main@': {
                    templateUrl: getView('test-view')
                }
            }
        })
        .state('app.export.detail.chapter.indicator', {
            url:'/:indicator/:indiname',
            views: {
                'header@': {
                    templateUrl: getView('header')
                },
                'sidebar@': {
                    templateUrl: getView('chapterContent')
                },
                'main@': {
                    templateUrl: getView('test-view')
                }
            }
        })
        .state('app.export.detail.chapter.indicator.country', {
            url:'/:iso'
        })
        .state('app.export.detail.chapter.indicator.country.compare', {
            url:'/:compare/:countries'
        });
}
