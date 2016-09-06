<!doctype html>
<html ng-app="app" ng-strict-di>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="{!! elixir('css/vendor.css') !!}">
    <link rel="stylesheet" href="{!! elixir('css/app.css') !!}">
    <link href='https://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <title>23° | mapping data for global understanding</title>

    <!--[if lte IE 10]>
    <script type="text/javascript">document.location.href = '/unsupported-browser'</script>
    <![endif]-->
</head>
<body flow-prevent-drop ng-class="{'iframed': $root.iframed, 'startup': $root.started, 'loggedIn': $root.isAuthenticated(), 'noHeader': $root.noHeader, 'greyed': $root.greyed, 'loose': $root.looseLayout,  'fixed': $root.fixLayout,'sidebar-closed': !$root.sidebarOpen, 'rowed': $root.rowed, 'addFull': $root.addFull}" layout="column">


    <!--div ui-view="header"></div-->
    <md-toolbar class="Header md-accent" tabindex="-1" >
        <header ui-view="header"></header>
    </md-toolbar>

    <md-sidenav id="sidebar" ui-view="sidebar" md-is-locked-open="$mdMedia('gt-sm')"></md-sidenav>
    <div class="main-view" ui-view="main"></div>
    <div id="fullscreen-view" ui-view="fullscreen" class="doAnim-fade-long" layout-fill ng-if="$root.fullscreenView" flex layout="row" layout-align="center center"></div>


    <md-content layout="row" flex style="overflow:hidden">
        <md-sidenav id="sidemenu" class="md-sidenav-left" md-component-id="leftMenu" ng-if="$root.isAuthenticated()" md-is-locked-open="$mdMedia('gt-sm')" tabindex="-1" md-scroll-y>
            <md-content flex  doAnim-right ui-view="sidemenu"  md-scroll-y layout="column" class="flex" layout-fill layout-align="space-between none"></md-content>
        </md-sidenav>
        <md-sidenav id="sidebar" md-is-open="$root.sidebarOpen" ng-if="$root.sidebar" class="md-sidenav-left md-whiteframe-z1 doAnim-hinge" md-component-id="left" md-is-locked-open="$mdMedia('gt-sm')" tabindex="-1" md-scroll-y>
            <div class="menu-toggler" md-swipe-up="$root.toggleMenu('left')" flex ng-click="$root.toggleMenu('left')" layout="row" layout-align="center center" show-xs></div>
            <md-content flex doAnim-right ui-view="sidebar" md-swipe-down="$root.toggleMenu('left')"  md-scroll-y></md-content>
        </md-sidenav>
        <md-content layout="row" flex role="main" tabindex="-1" md-scroll-y>
            <div ui-view="main" class="Page doAnim-hinge" ng-if="$root.mainView" flex md-scroll-y style="overflow-y:auto"></div>
            <div layout-fill layout="column" flex>
                <div ui-view="additional" class="additional doAnim-hinge" md-scroll-y style="overflow-y:auto" ng-if="$root.additional"></div>
                <div ui-view="map" class="Map_Container" id="map" flex></div>
            </div>
        </md-content>
    </md-content>
    <!--div class="mobile-window-switcher" hide-gt-sm>
        <md-button class="md-fab md-primary"  ng-click="$root.toggleMenu('left')" aria-label="Show Map/Info">
            <ng-md-icon icon="@{{$root.sidebarOpen ? 'map' : 'expand_less'}}" options='{"duration":300, "rotation":"none"}' size="32" style="top:12px;position:relative"></ng-md-icon>
        </md-button>
    </div>
    <div class="doAnim-hinge" id="items-menu" ng-include="'/views/app/conflictitems/conflictitems.html'" ng-cloak ng-if="$root.featureItems.length > 0 && $root.showItems"></div>
    <div id="main-logo" ui-view="logo" ng-if="$root.logoView" ></div>
    <div id="fullscreen-view" ui-view="fullscreen" class="doAnim-fade-long" layout-fill ng-if="$root.fullscreenView" flex layout="row" layout-align="center center"></div>
    <div class="cssload-container doAnim-fade" ng-if="$root.stateIsLoading">
        <div class="cssload-whirlpool"></div>
        <div class="cssload-text">23°</div>
    </div-->


    <script src="{!! elixir('js/vendor.js') !!}"></script>
    <script src="{!! elixir('js/partials.js') !!}"></script>
    <script src="{!! elixir('js/app.js') !!}"></script>

    <script src="assets/js/pbf.min.js"></script>
    <script src="assets/js/MapBoxVectorTile/dist/Leaflet.MapboxVectorTile.js"></script>

    {{--livereload--}}
    @if ( env('APP_ENV') === 'local' )
    <script type="text/javascript">
        document.write('<script src="'+ location.protocol + '//' + (location.host.split(':')[0] || 'localhost') +':35729/livereload.js?snipver=1" type="text/javascript"><\/script>')
    </script>
    @endif
</body>
</html>
