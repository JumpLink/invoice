// window.saveAs
// Shims the saveAs method, using saveBlob in IE10.
// And for when Chrome and FireFox get round to implementing saveAs we have their vendor prefixes ready.
// But otherwise this creates a object URL resource and opens it on an anchor tag which contains the "download" attribute (Chrome)
// ... or opens it in a new tab (FireFox)
// @author Andrew Dodson
// @copyright MIT, BSD. Free to clone, modify and distribute for commercial and personal use.
// https://gist.github.com/MrSwitch/3552985

window.saveAs || ( window.saveAs = (window.navigator.msSaveBlob ? function(b,n){ return window.navigator.msSaveBlob(b,n); } : false) || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs || (function(){
  // URL's
  window.URL || (window.URL = window.webkitURL);
  if(!window.URL){
    return false;
  }
  return function(blob,name){
    var url = URL.createObjectURL(blob);
    // Test for download link support
    if( "download" in document.createElement('a') ){
      var a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', name);
      // Create Click event
      var clickEvent = document.createEvent ("MouseEvent");
      clickEvent.initMouseEvent ("click", true, true, window, 0,
        event.screenX, event.screenY, event.clientX, event.clientY,
        event.ctrlKey, event.altKey, event.shiftKey, event.metaKey,
        0, null);
      // dispatch click event to simulate download
      a.dispatchEvent (clickEvent);
    }
    else{
      // fallover, open resource in new tab.
      window.open(url, '_blank', '');
    }
  };
})());

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

  $urlRouterProvider.otherwise('/signin');

  $stateProvider
  .state('ionic', {
    url: '/ionic'
    , abstract: true
    , templateUrl: "menu"
    , controller: 'IndexController'
  })
  .state('ionic.new-invoice-nav', {
    abstract: true
    , views: {
      'menuContent' : {
        templateUrl: 'new-invoice-nav'
        , controller: 'InvoiceNavController'
      }
    }
  })
  .state('ionic.new-invoice-nav.customer', {
    url: '/invoice/new/customer'
    , views: {
      'newInvoiceContent' : {
        templateUrl: 'new-invoice-nav/customer'
        , controller: 'InvoiceCustomerController'
      }
    }
  })
  .state('ionic.new-invoice-nav.services', {
    url: '/invoice/new/services'
    , views: {
      'newInvoiceContent' : {
        templateUrl: 'new-invoice-nav/services'
        , controller: 'InvoiceServiceController'
      }
    }
  })
  .state('ionic.new-invoice-nav.products', {
    url: '/invoice/new/products'
    , views: {
      'newInvoiceContent' : {
        templateUrl: 'new-invoice-nav/products'
        , controller: 'InvoiceProductController'
      }
    }
  })
  .state('ionic.new-invoice-nav.preview', {
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
