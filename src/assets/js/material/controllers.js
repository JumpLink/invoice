jumplink.invoice.controller('LayoutController', function($scope) {


});

jumplink.invoice.controller('LeftSideNavController', function($scope, $materialSidenav) {
  $scope.close = function() {
    console.log("close");
    $materialSidenav('left').close();
  };
});

// HOME
jumplink.invoice.controller('HomeContentController', function($scope) {

});

jumplink.invoice.controller('HomeToolbarController', function($scope, $materialSidenav, Fullscreen) {
  $scope.toggleLeft = function() {
    console.log("toggleLeft");
    $materialSidenav('left').toggle();
  };

  $scope.isFullscreen = false;
  Fullscreen.$on('FBFullscreen.change', function(evt, isFullscreenEnabled){
    $scope.isFullscreen = isFullscreenEnabled == true;
    $scope.$apply();
  });

  $scope.toggleFullscreen = function () {
    if (Fullscreen.isEnabled()) {
      Fullscreen.cancel();
    } else {
      Fullscreen.all();
    }
  };
});

// INVOICES LIST
jumplink.invoice.controller('InvoicesContentController', function($scope, invoiceCreaterService, $state) {

  $scope.addInvoice = function () {
    // console.log("new Invoice");
    $state.go('material-layout.invoices-new');
  }

});

// INVOICE NEW
jumplink.invoice.controller('InvoiceNewContentController', function($scope, invoiceCreaterService) {

  $scope.promotedAction = {
    expand: false
  }

  invoiceCreaterService.getData(function(error, invoice) {
    $scope.invoice = invoice;
  });

  $scope.expand = function() {
    $scope.promotedAction.expand = true;
  };

  $scope.unexpand = function() {
    $scope.promotedAction.expand = false;
  };

});

jumplink.invoice.controller('InvoiceNewToolbarController', function($scope, historyService) {
  $scope.goBack = function () {
    historyService.back();
  }
});
