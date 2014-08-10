angular.module('webodf', [])
  .directive('webodfview', function ($compile, $window) {

    /*
     * Request to server with file stream of the document.
     */
    var writeFile = function(folder, filename, type, data, callback) {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        var path = folder+"/"+filename;
        var blob = new Blob([data.buffer], {type : 'application/vnd.oasis.opendocument.'+type});
        var formData = new FormData();
        formData.append("WebODF", blob, filename);

        var request = new XMLHttpRequest();
        request.open("PUT", path);
        request.send(formData);
      } else {
        callback('The File APIs are not fully supported in this browser.');
      }
    }

    /*
     * Save document on server.
     */
    var saveAs = function(odfContainer, folder, filename, callback) {
      odfContainer.createByteArray(function(data) {
        writeFile(folder, filename, odfContainer.getDocumentType(), data, callback)
      }, callback);
    }

    /*
     * Get all custom user field variables and inputs.
     * return: Object {get: array of custom user field variables, decl: array of custom user field inputs}
     */
    var getUserFieldElements = function (odfParentNodeElement, callback) {
      var textns = "urn:oasis:names:tc:opendocument:xmlns:text:1.0";
      var userFieldsGet = odfParentNodeElement.getElementsByTagNameNS(textns, 'user-field-get');
      //- var userFieldsDecl = odfParentNodeElement.getElementsByTagNameNS(textns, 'user-field-decl');
      var userFieldsDecl = odfParentNodeElement.getElementsByTagNameNS(textns, 'user-field-decls')[0].childNodes;
      if(callback) callback(null, {get: UserFieldsGet, decl: UserFieldsDecl});
      return {get: userFieldsGet, decl: userFieldsDecl};
    }

    /*
     * Define new custom user field variable.
     * return: the new new custom user field variable element.
     */
    var newUserFieldDeclElement = function (odfContentNodeElement, name, value, type) {
      //TODO just if not exists
      var textns = "urn:oasis:names:tc:opendocument:xmlns:text:1.0";
      var userFieldsDecls = odfContentNodeElement.getElementsByTagNameNS(textns, 'user-field-decls')[0];
      var newElement = document.createElementNS(textns, 'text:user-field-decl');
      newElement.setAttribute('office:value-type', type); // float
      switch(type) {
        case 'float':
          newElement.setAttribute('office:value', value);
        break;
        case 'string':
        case 'time':
        default: // TODO test more types
          newElement.setAttribute('office:'+type+'-value', value);
        break;
      }
      newElement.setAttribute('text:name', name);
      userFieldsDecls.appendChild(newElement);
      return newElement;
    }

    /*
     * Redefine custom user field inputs (custom user field get elements).
     * This function updates and renames the custom user field inputs found in userFieldGetNodeElements
     */
    var redefineUserFieldGetElement = function (userFieldGetNodeElements, name, newname, value, callback) {
      var error;

      for (var i = 0; i < userFieldGetNodeElements.length; i++) {
        var element = userFieldGetNodeElements[i];
        var currentName = element.getAttribute('text:name');
        if(currentName === name) {
          element.textContent = value;
          element.setAttribute('text:name', newname);
        }
      };

      if(callback) callback(error, userFieldGetNodeElements);
      return error;
    }

    /*
     * Update custom user field inputs (custom user field get elements).
     * This function updates the inputs that are equal to "name" in "userFieldGetNodeElements" with "value".
     */
    var updateUserFieldGetElement = function (userFieldGetNodeElements, name, value, callback) {
      var error;

      for (var i = 0; i < userFieldGetNodeElements.length; i++) {
        var element = userFieldGetNodeElements[i];
        var currentName = element.getAttribute('text:name');
        if(currentName === name) {
          element.textContent = value;
        }
      };

      if(callback) callback(error, userFieldGetNodeElements);
      return error;
    }

    /*
     * Update custom user field variables (custom user field decl elements).
     * This function updates the variables that are equal to "name" in "userFieldDeclNodeElements" with "value".
     */
    var updateUserFieldDeclElement = function (userFieldDeclNodeElements, name, type, value, callback) {
      var error, notFound = true;
      for (var i = 0; i < userFieldDeclNodeElements.length; i++) {
        var element = userFieldDeclNodeElements[i];
        var currentName = element.getAttribute('text:name');
        var currentType = element.getAttribute('office:value-type');
        if(currentName === name) {
          notFound = false;
          if(currentType === type) {
            switch(type) {
              case 'float':
                element.setAttribute('office:value', value);
              break;
              case 'string':
              case 'time':
              default: // TODO test more types
                element.setAttribute('office:'+type+'-value', value);
              break;
            }
          } else {
            error = "wrong type: "+name+" should be "+currentType+" but you want "+type;
            if(callback) callback(error);
            return error;
          }
        }
      };

      if(notFound) {
        error = "not found";
        if(callback) callback(error);
        return error;
      }

      if(callback) callback(error, userFieldDeclNodeElements);

    }

    /*
     * Update custom user field variables (custom user field decl elements) and inputs (custom user field get elements).
     * This function updates the variable and inputs found in userFieldNodeElements.
     */
    var updateUserFieldElement = function (userFieldNodeElements, name, type, value, callback) {
      var error;
      if(typeof value != undefined && value != null) {
        updateUserFieldDeclElement(userFieldNodeElements.decl, name, type, value, function(error, userFieldDeclNodeElements){
          if(error) {
            if(callback) callback(error);
            return error;
          }
          updateUserFieldGetElement(userFieldNodeElements.get, name, value, function(error, userFieldGetNodeElements) {
            if(error) {
              if(callback) callback(error);
              return error;
            }
            callback(error, {get: userFieldGetNodeElements, decl: userFieldDeclNodeElements});
          });
        });
      } else {
        error = "value not set: "+name;
        callback(error);
      }

    }

    /*
     * Get all tables from parent node
     * return: array of table nodes
     */
    var getTables = function(odfParentNodeElement, callback) {
      var tablens = 'urn:oasis:names:tc:opendocument:xmlns:table:1.0';
      var tables = odfParentNodeElement.getElementsByTagNameNS(tablens, 'table');
      if(callback) callback(null, tables);
      return tables;
    }

    /*
     * Get table node by table name.
     * Required: array of table nodes
     */
    var getTableByName = function(tables, name, callback) {
      var error, notFound = true;
      for (var i = 0; i < tables.length; i++) {
        var element = tables[i];
        var currentName = element.getAttribute('table:name');
        if(currentName === name) {
          notFound = false;
          callback(error, element);
          return error;
        }
      };
      if(notFound) {
        error = "not found";
        callback(error);
        return error;
      }
    }

    /*
     * Custom insertAfter function as a contrast to the native insertBefore method
     * source: http://blog.svidgen.com/2007/10/javascript-insertafter.html
     */
    var insertAfter = function (newNodeElement, existingNodeElement) {
      // if the existing node has a following sibling, insert the current
      // node before it. otherwise appending it to the parent node
      // will correctly place it just after the existing node.
      if (existingNodeElement.nextSibling) {
        // there is a next sibling. insert before it using the mutual
        // parent's insertBefore() method.
        existingNodeElement.parentNode.insertBefore(newNodeElement, existingNodeElement.nextSibling);
      } else {
        // there is no next sibling. append to the end of sthe parent's
        // node list.
        existingNodeElement.parentNode.appendChild(newNodeElement);
      }
    }

    var getTaskarea = function (odfContentNodeElement) {
      var textns = "urn:oasis:names:tc:opendocument:xmlns:text:1.0";
      var sections = odfContentNodeElement.getElementsByTagNameNS(textns, 'section');
      for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        if(section.getAttribute('text:name') == 'taskarea')
          return section;
      };
      return null;
    }

    /*
     * Create a new task table based on "templateElement" and append as child to "taskarea".
     */
    var appendNewTaskTableElement = function (odfContentNodeElement, taskarea, templateElement, number, title, description, cost) {
      var textns = "urn:oasis:names:tc:opendocument:xmlns:text:1.0";
      var newTableElement = templateElement.cloneNode(true);
      var newTableUserFieldsGet = newTableElement.getElementsByTagNameNS(textns, 'user-field-get');
      newTableElement.setAttribute('table:name', 'tasktable.'+number);

      // create new custom user field for number
      newUserFieldDeclElement(odfContentNodeElement, "invoice.task."+number+".number", number, "float");
      // rename old custom user field to new created
      redefineUserFieldGetElement(newTableUserFieldsGet, "invoice.task.number", "invoice.task."+number+".number", number);

      // for title
      newUserFieldDeclElement(odfContentNodeElement, "invoice.task."+number+".title", title, "string");
      redefineUserFieldGetElement(newTableUserFieldsGet, "invoice.task.title", "invoice.task."+number+".title", title);

      // for description
      newUserFieldDeclElement(odfContentNodeElement, "invoice.task."+number+".description", description, "string");
      redefineUserFieldGetElement(newTableUserFieldsGet, "invoice.task.description", "invoice.task."+number+".description", description);

      // for cost
      newUserFieldDeclElement(odfContentNodeElement, "invoice.task."+number+".cost", cost, "string");
      redefineUserFieldGetElement(newTableUserFieldsGet, "invoice.task.cost", "invoice.task."+number+".cost", cost);

      taskarea.appendChild(newTableElement);
    }

    var initializeWidth = function(odfCanvas, element) {
      var paddingLeft = 0, paddingRight = 0, clientWidth = 0, innerWidth = 0;
      if(window) {
        paddingLeft = parseInt(window.getComputedStyle(element.parent()[0], null).getPropertyValue('padding-left'));
        paddingRight = parseInt(window.getComputedStyle(element.parent()[0], null).getPropertyValue('padding-right'));
      }
      clientWidth = element.parent()[0].clientWidth;
      innerWidth = clientWidth - paddingLeft - paddingRight;
      odfCanvas.fitSmart(innerWidth); // set width to 100% of parent element
    }

    var updateDocument = function(odfContentNodeElement, invoice) {

      var userFieldNodeElements = getUserFieldElements(odfContentNodeElement);

      if(invoice) {
        if(invoice.approver) {
          updateUserFieldElement(userFieldNodeElements, 'invoice.approver.name', 'string', invoice.approver.name, function(error) {
            if(error) console.log(error);
          });
          updateUserFieldElement(userFieldNodeElements, 'invoice.approver.address1', 'string', invoice.approver.address1, function(error) {
            if(error) console.log(error);
          });
          updateUserFieldElement(userFieldNodeElements, 'invoice.approver.place', 'string', invoice.approver.place, function(error) {
            if(error) console.log(error);
          });
          updateUserFieldElement(userFieldNodeElements, 'invoice.approver.email', 'string', invoice.approver.email, function(error) {
            if(error) console.log(error);
          });
          updateUserFieldElement(userFieldNodeElements, 'invoice.approver.web', 'string', invoice.approver.web, function(error) {
            if(error) console.log(error);
          });
          updateUserFieldElement(userFieldNodeElements, 'invoice.approver.phone', 'string', invoice.approver.phone, function(error) {
            if(error) console.log(error);
          });
          updateUserFieldElement(userFieldNodeElements, 'invoice.approver.fax', 'string', invoice.approver.fax, function(error) {
            if(error) console.log(error);
          });
          updateUserFieldElement(userFieldNodeElements, 'invoice.approver.ustid', 'string', invoice.approver.ustid, function(error) {
            if(error) console.log(error);
          });
          if(invoice.approver.bank) {
            updateUserFieldElement(userFieldNodeElements, 'invoice.approver.bank.owner', 'string', invoice.approver.bank.owner, function(error) {
              if(error) console.log(error);
            });
            updateUserFieldElement(userFieldNodeElements, 'invoice.approver.bank.name', 'string', invoice.approver.bank.name, function(error) {
              if(error) console.log(error);
            });
            updateUserFieldElement(userFieldNodeElements, 'invoice.approver.bank.iban', 'string', invoice.approver.bank.iban, function(error) {
              if(error) console.log(error);
            });
            updateUserFieldElement(userFieldNodeElements, 'invoice.approver.bank.bic', 'string', invoice.approver.bank.bic, function(error) {
              if(error) console.log(error);
            });
          }
        }

        if(invoice.approver) {
          updateUserFieldElement(userFieldNodeElements, 'invoice.recipient.name', 'string', invoice.recipient.name, function(error) {
            if(error) console.log(error);
          });
          updateUserFieldElement(userFieldNodeElements, 'invoice.recipient.address1', 'string', invoice.recipient.address1, function(error) {
            if(error) console.log(error);
          });
          updateUserFieldElement(userFieldNodeElements, 'invoice.recipient.place', 'string', invoice.recipient.place, function(error) {
            if(error) console.log(error);
          });
        }

        updateUserFieldElement(userFieldNodeElements, 'invoice.currency', 'string', invoice.currency, function(error) {
          if(error) console.log(error);
        });
        updateUserFieldElement(userFieldNodeElements, 'invoice.date', 'string', invoice.date, function(error) {
          if(error) console.log(error);
        });
        updateUserFieldElement(userFieldNodeElements, 'invoice.deadline', 'string', invoice.deadline, function(error) {
          if(error) console.log(error);
        });
        updateUserFieldElement(userFieldNodeElements, 'invoice.number', 'float', invoice.number, function(error) {
          if(error) console.log(error);
        });

        updateUserFieldElement(userFieldNodeElements, 'invoice.tax', 'string', invoice.tax, function(error) {
          if(error) console.log(error);
        });
        updateUserFieldElement(userFieldNodeElements, 'invoice.taxrate', 'float', invoice.taxrate, function(error) {
          if(error) console.log(error);
        });
        updateUserFieldElement(userFieldNodeElements, 'invoice.amount', 'string', invoice.amount, function(error) {
          if(error) console.log(error);
        });
        updateUserFieldElement(userFieldNodeElements, 'invoice.totalamount', 'string', invoice.totalamount, function(error) {
          if(error) console.log(error);
        });

        if(invoice.translate) {
          updateUserFieldElement(userFieldNodeElements, 'invoice.translate.invoice', 'string', invoice.translate.invoice, function(error) {
            if(error) console.log(error);
          });
          updateUserFieldElement(userFieldNodeElements, 'invoice.translate.amount', 'string', invoice.translate.amount, function(error) {
            if(error) console.log(error);
          });
          updateUserFieldElement(userFieldNodeElements, 'invoice.translate.totalamount', 'string', invoice.translate.totalamount, function(error) {
            if(error) console.log(error);
          });
          updateUserFieldElement(userFieldNodeElements, 'invoice.translate.tax', 'string', invoice.translate.tax, function(error) {
            if(error) console.log(error);
          });
          updateUserFieldElement(userFieldNodeElements, 'invoice.translate.phone', 'string', invoice.translate.phone, function(error) {
            if(error) console.log(error);
          });
          updateUserFieldElement(userFieldNodeElements, 'invoice.translate.fax', 'string', invoice.translate.fax, function(error) {
            if(error) console.log(error);
          });
        }
      }
    }

    var removeAllChilds = function (element) {
      while (element.firstChild) {
          element.removeChild(element.firstChild);
      }
    }

    var updateDocumentTasks = function(odfContentNodeElement, templateTaskTableElement, tasks) {
      var taskareaElement = getTaskarea(odfContentNodeElement);
      // remove all old tasks be shure to save the template task before
      removeAllChilds(taskareaElement);
      for (var i = 0; i < tasks.length; i++) {
        appendNewTaskTableElement(odfContentNodeElement, taskareaElement, templateTaskTableElement, i+1, tasks[i].title, tasks[i].description, tasks[i].cost);
      };
    }

    return {
      restrict: 'E',
      scope: {file : "@", invoice: "=", save: "=", refresh: "="},
      link: function ($scope, $element, $attrs) {

        var nid = 'odt' + Math.floor((Math.random()*100)+1);
        $element.attr('id', nid);
        var odfCanvas = new odf.OdfCanvas($element[0]);
        odfCanvas.load($scope.file);

        // Callback fired after odf document is ready
        odfCanvas.addListener("statereadychange", function () {
          var odfContainer = odfCanvas.odfContainer();
          var odfContentNodeElement = odfContainer.getContentElement();
          getTableByName(getTables(odfCanvas.odfContainer().getContentElement()), 'tasktable', function(error, templateTaskTableElement) {
            // update width on resize
            if(false) { // TODO
              angular.element($window).bind('resize', function() {
                initializeWidth(odfCanvas, $element);
                $scope.$apply();
              });
            }

            initializeWidth(odfCanvas, $element);

            // $scope.$watchCollection('invoice', function(newNames, oldNames) {
            //   updateDocument(odfContentNodeElement, newNames);
            // });

            // $scope.$watchCollection('invoice.task', function(newValues, oldValues) {
            //   updateDocumentTasks(odfContentNodeElement, templateTaskTableElement, newValues);
            // });

            $scope.refresh = function () {
              updateDocument(odfContentNodeElement, $scope.invoice);
              updateDocumentTasks(odfContentNodeElement, templateTaskTableElement, $scope.invoice.task);
            }

            odfCanvas.refreshSize();

            $scope.save = function () {
              console.log("save");
              saveAs(odfContainer, "/odf", "new.odt", function(error) {
                if(error) console.log(error);
              });
            }
          });
        });

      }
    };
  });
