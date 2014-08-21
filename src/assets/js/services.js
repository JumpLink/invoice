jumplink.invoice.factory('invoiceCreaterService', function ($filter, moment) {
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

    var recipient = {
      name: "customer"
      , address1: "address1"
      , address2: "address2"
      , address3: "address3"
    }

    var services = []
    services.push({
      title: ""
      , description: ""
      , cost: 0
    });

    var products = []
    products.push({
      title: ""
      , description: ""
      , cost: 0
    });


    var translate = {
      invoice: "Rechnung"
      , amount: "Summe"
      , totalamount: "Gesamtsumme"
      , tax: "Umsatzsteuer"
      , phone: "Telefon"
      , fax: "Fax"
      , hours: "Stunden"
      , rate: "Tarif"
      , total: "Gesamt"
      , price: "Preis"
    }

    var now = moment();
    var deadline = moment().add('weeks', 2);

    var invoice = {
      approver: approver
      , recipient: recipient
      , currency: "Euro"
      , date: $filter('amDateFormat')(now, 'dddd, Do MMMM YYYY')
      , deadline: $filter('amDateFormat')(deadline, 'dddd, Do MMMM YYYY')
      , services: services
      , products: products
      , number: 1
      , tax: 0
      , taxrate: 0
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

  var addService = function() {
    currentInvoice.services.push({
      title: ""
      , description: ""
      , cost: 0
    });
  }

  var removeService = function() {
    currentInvoice.services.pop();
  }

  var addProduct = function() {
    currentInvoice.products.push({
      title: ""
      , description: ""
      , cost: 0
    });
  }

  var removeProduct = function() {
    currentInvoice.products.pop();
  }

  return {
    addService: addService
    , removeService: removeService
    , addProduct: addProduct
    , removeProduct: removeProduct
    , fetchData: fetchData
    , newInvoice: newInvoice
    , getData: getData
  };
});
