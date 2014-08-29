jumplink.invoice.service('historyService', function ($window) {
  var back = function () {
    $window.history.back();
  }

  return {
    back: back
  };
});

jumplink.invoice.factory('invoiceCreaterService', function (moment, $translate) {
  var currentInvoice;

  var fetchData = function (callback) {
    var bank = {
      owner: "Pascal Garber"
      , name: "Volksbank Hamburg"
      , iban: "DE63201900030071312102"
      , bic: "GENODEF1HH2"
    }

    var approver = {
      name: "JumpLink"
      , address1: "Bei der Kirche 12"
      , place: "27476 Cuxhaven"
      , email: "info@jumplink.eu"
      , web: "www.jumplink.eu"
      , phone: "0152 55 19 12 50"
      , fax: "placeholder"
      , ustid: "DE277453808"
      , bank: bank
    }

    // var recipient = {
    //   name: "customer"
    //   , email: "test@test.eu"
    //   , address1: "address1"
    //   , address2: "address2"
    //   , address3: "address3"
    // }

    var services = []
    // services.push({
    //   title: ""
    //   , description: ""
    //   , cost: 0
    // });

    // TODO rename to expenditures
    var products = []
    // products.push({
    //   title: ""
    //   , description: ""
    //   , cost: 0
    // });

    var translate = {};

    $translate("Invoice").then(function (translation) {
      translate.invoice = translation;
    });
    $translate("amount").then(function (translation) {
      translate.amount = translation;
    });
    $translate("totalamount").then(function (translation) {
      translate.totalamount = translation;
    });
    $translate("tax").then(function (translation) {
      translate.tax = translation;
    });
    $translate("phone").then(function (translation) {
      translate.phone = translation;
    });
    $translate("fax").then(function (translation) {
      translate.fax = translation;
    });
    $translate("hours").then(function (translation) {
      translate.hours = translation;
    });
    $translate("rate").then(function (translation) {
      translate.rate = translation;
    });
    $translate("total").then(function (translation) {
      translate.total = translation;
    });
    $translate("price").then(function (translation) {
      translate.price = translation;
    });
    // var translate = {
    //   invoice: "Rechnung"
    //   , amount: "Summe"
    //   , totalamount: "Gesamtsumme"
    //   , tax: "Umsatzsteuer"
    //   , phone: "Telefon"
    //   , fax: "Fax"
    //   , hours: "Stunden"
    //   , rate: "Tarif"
    //   , total: "Gesamt"
    //   , price: "Preis"
    // }

    var invoice = {
      approver: approver
      // , recipient: recipient
      , currency: "Euro"
      , date: moment() // now; example filter: $filter('amDateFormat')(now, 'dddd, Do MMMM YYYY')
      , deadline: moment().add('month', 1) // in one month; example filter: $filter('amDateFormat')(deadline, 'dddd, Do MMMM YYYY')
      , services: services
      , products: products
      , number: 1
      , taxrate: 0
      , tax: 0
      , amount: 100
      , totalamount: 100
      , translate: translate
    }
    callback(null, invoice);
  }

  getData = function(callback) {
    if(currentInvoice)
      return callback(null, currentInvoice);
    else
      return newInvoice(callback);
  }

  var newInvoice = function(callback) {
    fetchData(function(error, data) {
      currentInvoice = data;
      callback(null, currentInvoice);
    });
  }

  var getEmptyServiceObject = function() {
    return {
      title: ""
      , description: ""
      , cost: 0
    };
  }

  var addService = function(service) {
    if(!service) service = getEmptyServiceObject();
    currentInvoice.services.push(service);
  }

  var removeService = function() {
    currentInvoice.services.pop();
  }

  var getEmptyExpenditureObject = function() {
    return {
      title: ""
      , description: ""
      , cost: 0
    };
  }

  var addExpenditure = function(expenditure) {
    if(!expenditure) expenditure = getEmptyExpenditureObject();
    currentInvoice.products.push(expenditure);
  }

  var removeExpenditure = function() {
    currentInvoice.products.pop();
  }

  var getEmptyRecipientObject = function() {
    return {
      name: ""
      , email: ""
      , address1: ""
      , address2: ""
      , address3: ""
    }
  }

  var setRecipient = function(recipient) {
    if(!recipient) recipient = getEmptyRecipientObject();
    currentInvoice.recipient = recipient;
  }

  return {
    addService: addService
    , getEmptyServiceObject: getEmptyServiceObject
    , removeService: removeService
    , getEmptyExpenditureObject: getEmptyExpenditureObject
    , removeExpenditure: removeExpenditure
    , getEmptyRecipientObject: getEmptyRecipientObject
    , setRecipient: setRecipient
    , addExpenditure: addExpenditure
    , fetchData: fetchData
    , newInvoice: newInvoice
    , getData: getData
  };
});
