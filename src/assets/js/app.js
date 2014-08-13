if (typeof jumplink === 'undefined') {
  var jumplink = {};
}

jumplink.invoice = angular.module('jumplink.invoice', [
  'ngRoute'
  , 'ngAnimate'
  , 'ngSanitize'
  , 'sails.io'
  , 'monospaced.qrcode'
  , 'angularMoment'
  , 'mgcrea.ngStrap'
  , 'webodf'
  , 'pascalprecht.translate'  // localization
  , 'tmh.dynamicLocale'       // localization
]);

jumplink.invoice.config( function($routeProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider) {
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

  // localization
  $translateProvider.useUrlLoader('/locale/catalog');
  $translateProvider.preferredLanguage('en');
  tmhDynamicLocaleProvider.localeLocationPattern('/third-party/angular-i18n/angular-locale_{{locale}}.js');
});


jumplink.invoice.run(function(amMoment, tmhDynamicLocale, $translate, $rootScope) {

  // switch locale automaticly on $rootScope.$locale change
  $rootScope.$watch('$locale', function(newValue, oldValue) {
    console.log(newValue);
    tmhDynamicLocale.set(newValue);
    amMoment.changeLanguage(newValue);
    $translate.use(newValue);
  });

  // auto detect user's language
  var userLang = navigator.language || navigator.userLanguage;
  switch(userLang) {
    // available languaes
    case 'en':
    case 'de':
    break;
    default:
      console.log("Your language '"+userLang+" is not supported, switch to 'en'");
      userLang = 'en';
    break;
  }

  $rootScope.$locale = userLang;
});
