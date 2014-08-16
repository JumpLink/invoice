if (typeof jumplink === 'undefined') {
  var jumplink = {};
}

jumplink.invoice = angular.module('jumplink.invoice', [
  'ui.router'
  , 'ngAnimate'
  , 'ngSanitize'
  , 'sails.io'
  , 'monospaced.qrcode'
  , 'angularMoment'
  , 'webodf'
  , 'ionic'
  , 'pascalprecht.translate'  // localization
  , 'tmh.dynamicLocale'       // localization
]);

jumplink.invoice.config( function($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider) {

  $urlRouterProvider.otherwise('/app/invoice/new/customer');

  $stateProvider
  .state('menu', {
    url: '/app'
    , abstract: true
    , templateUrl: "menu"
    , controller: 'IndexController'
  })
  .state('menu.new-invoice-nav', {
    abstract: true
    , views: {
      'menuContent' : {
        templateUrl: 'new-invoice-nav'
        , controller: 'InvoiceNavController'
      }
    }
  })
  .state('menu.new-invoice-nav.customer', {
    url: '/invoice/new/customer'
    , views: {
      'newInvoiceContent' : {
        templateUrl: 'new-invoice-nav/customer'
        , controller: 'InvoiceCustomerController'
      }
    }
  })
  .state('menu.new-invoice-nav.tasks', {
    url: '/invoice/new/tasks'
    , views: {
      'newInvoiceContent' : {
        templateUrl: 'new-invoice-nav/tasks'
        , controller: 'InvoiceTaskController'
      }
    }
  })
  .state('menu.new-invoice-nav.preview', {
    url: '/invoice/new/preview'
    , views: {
      'newInvoiceContent' : {
        templateUrl: 'new-invoice-nav/preview'
        , controller: 'InvoicePreviewController'
      }
    }
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
