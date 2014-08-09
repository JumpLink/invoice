if (typeof jumplink === 'undefined') {
  var jumplink = {};
}

jumplink.invoice = angular.module('jumplink.invoice', [
  'ngRoute'
  , 'ngAnimate'
  , 'ngSanitize'
  , 'ngSails'
  , 'monospaced.qrcode'
  , 'angularMoment'
  , 'mgcrea.ngStrap'
  , 'webodf'
]);
