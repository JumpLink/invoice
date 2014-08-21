jumplink.invoice.controller('IndexController', function($scope) {

});

jumplink.invoice.controller('InvoiceNavController', function($scope) {

});

jumplink.invoice.controller('InvoiceCustomerController', function($scope) {

});

jumplink.invoice.controller('InvoicePreviewController', function($scope, invoiceCreaterService) {

  // $scope.invoice = invoiceCreaterService.getData();
  invoiceCreaterService.getData(function(error, invoice) {
    $scope.invoice = invoice;
  });

  console.log($scope.invoice);

  $scope.upload = function() {
    $scope.webodf.upload();
  }

  $scope.download = function() {
    $scope.webodf.download();
  }

  $scope.refresh = function() {
    $scope.webodf.refresh();
  }

  var onWebODFReady = function() {
    $scope.refresh();
  }


  $scope.webodf = {
    ready: onWebODFReady
  };


});

jumplink.invoice.controller('InvoiceServiceController', function($scope, invoiceCreaterService) {

  // invoiceCreaterService.newInvoice(function(error, invoice) {
  //   $scope.invoice = invoice;
  // });
  invoiceCreaterService.getData(function(error, invoice) {
    $scope.invoice = invoice;
  });

  $scope.addService = function() {
    invoiceCreaterService.addService();
  }

  $scope.removeService = function() {
    invoiceCreaterService.removeService();
  }

});

jumplink.invoice.controller('InvoiceProductController', function($scope, invoiceCreaterService) {

  invoiceCreaterService.getData(function(error, invoice) {
    $scope.invoice = invoice;
  });

  $scope.addProduct = function() {
    invoiceCreaterService.addProduct();
  }

  $scope.removeService = function() {
    invoiceCreaterService.removeProduct();
  }

});
