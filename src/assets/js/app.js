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
  , 'pascalprecht.translate'
]);
