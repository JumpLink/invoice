jumplink.invoice.controller('IndexController', function($scope) {

});

jumplink.invoice.controller('InvoiceController', function($scope) {

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
    , place: "place"
  }

  var task = []
  task.push({
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
  }

  $scope.invoice = {
    approver: approver
    , recipient: recipient
    , currency: "Euro"
    , date: new Date()
    , deadline: new Date()
    , task: task
    , number: 1
    , tax: 0
    , taxrate: 0
    , amount: 100
    , totalamount: 100
    , translate: translate
  }

  $scope.addTask = function() {
    task.push({
      title: ""
      , description: ""
      , cost: 0
    });
  }

  $scope.removeTask = function() {
    task.pop();
  }

});
