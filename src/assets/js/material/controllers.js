jumplink.invoice.controller('LayoutController', function($scope) {


});

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

jumplink.invoice.controller('LeftSideNavController', function($scope, $materialSidenav) {
  $scope.close = function() {
    console.log("close");
    $materialSidenav('left').close();
  };
});
