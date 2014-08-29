jumplink.invoice.controller('AppController', function($scope, $materialSidenav, Fullscreen) {
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

jumplink.invoice.controller('LayoutController', function($scope, $materialSidenav, Fullscreen) {


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

jumplink.invoice.controller('HomeToolbarController', function($scope) {

});

// INVOICES LIST
jumplink.invoice.controller('InvoicesContentController', function($scope, invoiceCreaterService, $state) {

  $scope.addInvoice = function () {
    // console.log("new Invoice");
    $state.go('material-layout.invoices-new');
  }

});

// INVOICE NEW
jumplink.invoice.controller('InvoiceNewContentController', function($scope, invoiceCreaterService, invoice, $materialDialog) {

  $scope.invoice = invoice; // result of resolve from ui-route
  var $hideDialog; // ned to be setted by open dialog functions

  // default promoted Action is not exanded
  $scope.promotedAction = {
    expand: false
  }

  $scope.expand = function() {
    $scope.promotedAction.expand = true;
  };

  $scope.unexpand = function() {
    $scope.promotedAction.expand = false;
  };

  $scope.openServiceDialog = function($event, service) {
    $scope.unexpand(); // close the promoted Action bar
    $hideDialog = $materialDialog({
      templateUrl: 'material/invoices/new/serviceDialog',
      controller: 'ServiceDialogController',
      targetEvent: $event,
      locals: {
        service: service
      }
    });
  };

  $scope.openExpenditureDialog = function($event, expenditure) {
    $scope.unexpand(); // close the promoted Action bar
    $hideDialog = $materialDialog({
      templateUrl: 'material/invoices/new/expenditureDialog',
      controller: 'ExpenditureDialogController',
      targetEvent: $event,
      locals: {
        expenditure: expenditure
      }
    });
  };

  $scope.openRecipientDialog = function($event, recipient) {
    $scope.unexpand(); // close the promoted Action bar
    var settings = {
      templateUrl: 'material/invoices/new/recipientDialog',
      controller: 'RecipientDialogController',
      targetEvent: $event,
      locals: {
        recipient: recipient
      }
    }
    $hideDialog = $materialDialog(settings);
  };

  $scope.$on('$viewContentLoaded', function() {
    console.log("$viewContentLoaded");
  });

});

jumplink.invoice.controller('InvoiceNewToolbarController', function($scope, historyService) {
  $scope.goBack = function () {
    historyService.back();
  }
});

jumplink.invoice.controller('ServiceDialogController', function($scope, $hideDialog, invoiceCreaterService, service) {
  if(!service) $scope.service = invoiceCreaterService.getEmptyServiceObject();
  else $scope.service = service
  $scope.close = function() {
    if($hideDialog) $hideDialog();
    else console.log("No dialog to close!");
  };

  $scope.add = function() {
    invoiceCreaterService.addService($scope.service);
    $scope.close();
  }
});

jumplink.invoice.controller('ExpenditureDialogController', function($scope, $hideDialog, invoiceCreaterService, expenditure) {
  if(!expenditure) $scope.expenditure = invoiceCreaterService.getEmptyExpenditureObject();
  else $scope.expenditure = expenditure
  $scope.close = function() {
    if($hideDialog) $hideDialog();
    else console.log("No dialog to close!");
  };

  $scope.add = function() {
    invoiceCreaterService.addExpenditure($scope.expenditure);
    $scope.close();
  }
});

jumplink.invoice.controller('RecipientDialogController', function($scope, $hideDialog, invoiceCreaterService, recipient) {
  if(!recipient) $scope.recipient = invoiceCreaterService.getEmptyRecipientObject();
  else $scope.recipient = recipient
  $scope.close = function() {
    if($hideDialog) $hideDialog();
    else console.log("No dialog to close!");
  };

  $scope.add = function() {
    invoiceCreaterService.setRecipient($scope.recipient);
    $scope.close();
  }
});
