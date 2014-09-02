jumplink.invoice.config( function($translateProvider, tmhDynamicLocaleProvider) {

  // localization
  $translateProvider.useUrlLoader('/locale/catalog');
  $translateProvider.preferredLanguage('en');
  tmhDynamicLocaleProvider.localeLocationPattern('/third-party/angular-i18n/angular-locale_{{locale}}.js');
});


jumplink.invoice.run(function(amMoment, tmhDynamicLocale, $translate, $rootScope) {
  $rootScope.langReady = false;
  // switch locale automaticly on $rootScope.$locale change
  $rootScope.$watch('$locale', function(newValue, oldValue) {
    $rootScope.langReady = false;
    console.log(newValue);
    tmhDynamicLocale.set(newValue);
    amMoment.changeLanguage(newValue);
    $translate.use(newValue).then(function(data){
      $rootScope.langReady = true;
    });;
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
