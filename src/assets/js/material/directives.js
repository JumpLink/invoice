/**
 * Call clickAnywhereButHere Attribute after mouse click event outside of this directive
 */
jumplink.invoice.directive('clickAnywhereButHere', function($document){
  return {
    restrict: 'A',
    link: function(scope, elem, attr, ctrl) {
      elem.bind('click', function(e) {
        // this part keeps it from firing the click on the document.
        e.stopPropagation();
      });
      $document.bind('click', function() {
        // magic here.
        scope.$apply(attr.clickAnywhereButHere);
      })
    }
  }
});

/**
 * Expand this html element with Animation on expand-me attribute change
 */
jumplink.invoice.directive("expandMe", function($animate) {
  return function(scope, element, attrs) {
    scope.$watch(attrs.expandMe, function(newVal) {
      if (newVal) {
        $animate.addClass(element, "expanded")
      } else {
        $animate.removeClass(element, "expanded")
      }
    });
  }
});

/**
 * Expand and square this html element with Animation on square-and-expand-me attribute change
 */
jumplink.invoice.directive("squareAndExpandMe", function($animate, $timeout) {
  return function(scope, element, attrs) {
    scope.originalStyle = true;
    scope.expandedStyle = false;
    scope.$watch(attrs.squareAndExpandMe, function(newVal) {
      if (newVal) {
        // transform style
        scope.originalStyle = false; // style is not originalStyle now, the transformation animation begins.
        $animate.addClass(element, "squareed");
        $timeout(function() {
          $animate.addClass(element, "expanded");
          $timeout(function() {
            scope.expandedStyle = true; // complitly expanded, now.
          }, 300);
        }, 200);
      } else {
        // reverse style
        scope.expandedStyle = false; // no longer complitly expanded, but not yet fully in the originalStyle condition
        // wait 300 ms to animate stuff for the childs
        $timeout(function() {
          $animate.removeClass(element, "expanded")
          $timeout(function() {
            $animate.removeClass(element, "squareed");
            scope.originalStyle = true; // style is back to originalStyle now, the transformation animation is reversed and done.
          }, 200);
        }, 300);
      }
    });
  }
});
