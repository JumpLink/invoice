jumplink.invoice.config( function($routeProvider, $locationProvider, $translateProvider) {
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

    $translateProvider.useUrlLoader('/locale/catalog');

    // $translateProvider.translations('en', {
    //   TITLE: 'Hello',
    //   FOO: 'This is a paragraph.',
    //   BUTTON_LANG_EN: 'english',
    //   BUTTON_LANG_DE: 'german'
    // });
    $translateProvider.preferredLanguage('de');
  }
);
