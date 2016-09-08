<!doctype html>
<html ng-app="app" ng-strict-di>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="css/vendor.css">
    <link rel="stylesheet" href="css/app.css">
    <link href='https://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <title>23° | mapping data for global understanding</title>

    <!--[if lte IE 10]>
    <script type="text/javascript">document.location.href = '/unsupported-browser'</script>
    <![endif]-->
</head>
<body flow-prevent-drop ng-class="{'iframed': $root.iframed, 'startup': $root.started, 'loggedIn': $root.isAuthenticated(), 'noHeader': $root.noHeader, 'greyed': $root.greyed, 'loose': $root.looseLayout,  'fixed': $root.fixLayout,'sidebar-closed': !$root.sidebarOpen, 'rowed': $root.rowed, 'addFull': $root.addFull}" layout="column">


    <!--div ui-view="header"></div-->
    <div layout="column" layout-fill>
      <md-toolbar class="Header md-accent" tabindex="-1" >
          <header ui-view="header"></header>
      </md-toolbar>
      <div class="main-view" ui-view="main" flex></div>
      <md-sidenav md-whiteframe="1" id="sidebar" ui-view="sidebar" md-is-locked-open="$mdMedia('gt-sm')"></md-sidenav>
    </div>
    <div id="fullscreen-view" ui-view="fullscreen" class="doAnim-fade-long" layout-fill ng-if="$root.fullscreenView" flex layout="row" layout-align="center center"></div>

    <!--div class="mobile-window-switcher" hide-gt-sm>
        <md-button class="md-fab md-primary"  ng-click="$root.toggleMenu('left')" aria-label="Show Map/Info">
            <ng-md-icon icon="@{{$root.sidebarOpen ? 'map' : 'expand_less'}}" options='{"duration":300, "rotation":"none"}' size="32" style="top:12px;position:relative"></ng-md-icon>
        </md-button>
    </div>
    <div class="doAnim-hinge" id="items-menu" ng-include="'/views/app/conflictitems/conflictitems.html'" ng-cloak ng-if="$root.featureItems.length > 0 && $root.showItems"></div>
    <div id="main-logo" ui-view="logo" ng-if="$root.logoView" ></div>
    -->
    <div class="cssload-container" ng-if="$root.isLoading">
        <!-- <md-icon>map</md-icon> -->
        <div class="progress">
        <md-progress-circular md-diameter="100" md-mode="indeterminate" ></md-progress-circular>
      </div>
    </div>



    <script src="js/vendor.js"></script>
    <script src="js/partials.js"></script>
    <script src="js/app.js"></script>

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
