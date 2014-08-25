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

jumplink.invoice.config( function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/ionic/invoice/new/customer');

  $stateProvider
  .state('ionic', {
    url: '/ionic'
    , abstract: true
    , templateUrl: "ionic/menu"
    , controller: 'IndexController'
  })
  .state('ionic.new-invoice-nav', {
    abstract: true
    , views: {
      'menuContent' : {
        templateUrl: 'ionic/new-invoice-nav'
        , controller: 'InvoiceNavController'
      }
    }
  })
  .state('ionic.new-invoice-nav.customer', {
    url: '/invoice/new/customer'
    , views: {
      'newInvoiceContent' : {
        templateUrl: 'ionic/new-invoice-nav/customer'
        , controller: 'InvoiceCustomerController'
      }
    }
  })
  .state('ionic.new-invoice-nav.services', {
    url: '/invoice/new/services'
    , views: {
      'newInvoiceContent' : {
        templateUrl: 'ionic/new-invoice-nav/services'
        , controller: 'InvoiceServiceController'
      }
    }
  })
  .state('ionic.new-invoice-nav.products', {
    url: '/invoice/new/products'
    , views: {
      'newInvoiceContent' : {
        templateUrl: 'ionic/new-invoice-nav/products'
        , controller: 'InvoiceProductController'
      }
    }
  })
  .state('ionic.new-invoice-nav.preview', {
    url: '/invoice/new/preview'
    , views: {
      'newInvoiceContent' : {
        templateUrl: 'ionic/new-invoice-nav/preview'
        , controller: 'InvoicePreviewController'
      }
    }
  })
  ;
});
