jumplink.invoice = angular.module('jumplink.invoice', [
  'ui.router'                 // AngularUI Router: https://github.com/angular-ui/ui-router
  , 'ngAnimate'               // ngAnimate: https://docs.angularjs.org/api/ngAnimate
  , 'ngSanitize'              // ngSanitize: https://docs.angularjs.org/api/ngSanitize
  , 'sails.io'                // angularSails: https://github.com/balderdashy/angularSails
  , 'monospaced.qrcode'       // Angular QR Code: https://github.com/monospaced/angular-qrcode
  , 'angularMoment'           // angular-moment: https://github.com/urish/angular-moment
  , 'webodf'                  // custom module
  , 'FBAngular'               // angular-fullscreen: https://github.com/fabiobiondi/angular-fullscreen
  , 'ngMaterial'              // Material Design for Angular: https://github.com/angular/material
  , 'pascalprecht.translate'  // localization angular-translate: https://github.com/angular-translate/angular-translate
  , 'tmh.dynamicLocale'       // localization angular-dynamic-locale: https://github.com/lgalfaso/angular-dynamic-locale
]);

jumplink.invoice.config( function($stateProvider, $urlRouterProvider, $locationProvider) {

  // use the HTML5 History API
  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/material/home');

  $stateProvider
  // LAYOUT
  .state('material-layout', {
    url: '/material'
    , abstract: true
    , templateUrl: "material/layout"
    , controller: 'LayoutController'
  })
  // HOME
  .state('material-layout.home', {
    url: '/home'
    , views: {
      'leftSideNav': {
        templateUrl: 'material/leftSideNav'
        , controller: 'LeftSideNavController'
      }
      , 'content' : {
        templateUrl: 'material/home/content'
        , controller: 'HomeContentController'
      }
      , 'toolbar' : {
        templateUrl: 'material/home/toolbar'
        , controller: 'HomeToolbarController'
      }
    }
  })
  // INVOICES
  .state('material-layout.invoices', {
    url: '/invoices'
    , views: {
      'leftSideNav': {
        templateUrl: 'material/leftSideNav'
        , controller: 'LeftSideNavController'
      }
      , 'content' : {
        templateUrl: 'material/invoices/content'
        , controller: 'InvoicesContentController'
      }
      , 'toolbar' : {
        templateUrl: 'material/invoices/toolbar'
        , controller: 'HomeToolbarController'
      }
    }
  })
  .state('material-layout.invoices-new', {
    url: '/invoices/new'
    , views: {
      'leftSideNav': {
        templateUrl: 'material/leftSideNav'
        , controller: 'LeftSideNavController'
      }
      , 'content' : {
        templateUrl: 'material/invoices/new/content'
        , controller: 'InvoiceNewContentController'
      }
      , 'toolbar' : {
        templateUrl: 'material/invoices/new/toolbar'
        , controller: 'InvoiceNewToolbarController'
      }
    }
    ,resolve: {
      invoice: function ($q, invoiceCreaterService) {
        var deferred = $q.defer();
        invoiceCreaterService.getData(function(error, invoice) {
          if(error || !invoice) {
            deferred.reject(error);
          } else {
            deferred.resolve(invoice);
          }
        });
        return deferred.promise;
      }
    }
  })
  .state('material-layout.invoices-preview', {
    url: '/invoices/preview'
    , views: {
      'leftSideNav': {
        templateUrl: 'material/leftSideNav'
        , controller: 'LeftSideNavController'
      }
      , 'content' : {
        templateUrl: 'material/invoices/new/preview/content'
        , controller: 'InvoicePreviewContentController'
      }
      , 'toolbar' : {
        templateUrl: 'material/invoices/new/preview/toolbar'
        , controller: 'InvoiceNewToolbarController'
      }
    }
    ,resolve: {
      invoice: function ($q, invoiceCreaterService) {
        var deferred = $q.defer();
        invoiceCreaterService.getData(function(error, invoice) {
          if(error || !invoice) {
            deferred.reject(error);
          } else {
            deferred.resolve(invoice);
          }
        });
        return deferred.promise;
      }
    }
  })
  ;
});
