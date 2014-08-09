jumplink.invoice.config( function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
      templateUrl: '/'
      , controller: 'IndexController'
      , reloadOnSearch: false
    })
    .when('/invoice/new', {
      templateUrl: '/invoice/new'
      , controller: 'InvoiceController'
      , reloadOnSearch: false
    })
    .otherwise({
      redirectTo: '/'
    })
    ;
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }
);
