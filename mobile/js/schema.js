/**************************
 ***** TABLE CREATION *****
 **************************/

function initializeRealmObjects() {
  createTableObjects();
}

/**
 * Realm table creation
 */
function createTableObjects() {
  createDepartmentsTable(function() {
      createDocumentsTable(function(){
        createEmployeesTable(function() {
          out("Realm table setup complete");
          setGlobalDepartments(function(){});
        }, function (error) {
          out(error);
        });
      }, function(error) {
        out(error);
      });
    }, function (error) {
      out(error);
    }
  );
}

/**
 * Departments Table
 */
function createDepartmentsTable(successFn, errorFn) {
  var realm = getRealmController();
  realm.createObject(REALM_OBJECT_NAME_DEPARTMENTS, function() {
      // Table created, add the fields
      var fields = [
        {"name":"id", "type":"STRING", "key":true}
        , {"name":"name", "type":"STRING", "index":true}
      ];
      addFields(REALM_OBJECT_NAME_DEPARTMENTS, fields, function() {
        successFn();
      }, function (error) {
        errorFn(error);
      });
    }, function(error) {
      errorFn(error);
    });
}

/**
 * Documents Table
 */
function createDocumentsTable(successFn, errorFn) {
  var realm = getRealmController();
  realm.createObject(REALM_OBJECT_NAME_DOCUMENTS, function() {
      // Table created, add the fields
      var fields = [
        {"name":"id", "type":"STRING"}
        , {"name":"title", "type":"STRING"}
        , {"name":"filename", "type":"STRING", "key":true}
        , {"name":"created", "type":"DATE"}
        , {"name":"modified", "type":"DATE"}
      ];
      addFields(REALM_OBJECT_NAME_DOCUMENTS, fields, function() {
        successFn();
      }, function (error) {
        errorFn(error);
      });
    }, function(error) {
      errorFn(error);
    });
}

/**
 * Employees Table
 */
function createEmployeesTable(successFn, errorFn) {
  var realm = getRealmController();
  realm.createObject(REALM_OBJECT_NAME_EMPLOYEES, function() {
      // Table created, add the fields
      var fields = [
        {"name":"id", "type":"STRING", "key":true}
        , {"name":"employee", "type":"STRING", "index":true}
        , {"name":"contact", "type":"STRING"}
        , {"name":"region", "type":"STRING"}
        , {"name":"ability", "type":"INTEGER"}
        , {"name":"active", "type":"BOOLEAN"}
        , {"name":"department", "type":"OBJECT", "relationship":REALM_OBJECT_NAME_DEPARTMENTS} // One to One relationship
        , {"name":"documents", "type":"LIST", "relationship":REALM_OBJECT_NAME_DOCUMENTS} // One to Many relationship
      ];
      addFields(REALM_OBJECT_NAME_EMPLOYEES, fields, function() {
        successFn();
      }, function (error) {
        errorFn(error);
      });
    }, function(error) {
      errorFn(error);
    });
}

/**
 * Realm table field addition
 */
function addFields(object, fields, successFn, errorFn) {
  var realm = getRealmController();

  realm.addFields(
    object
    , fields
    , function(description) {
      successFn();
    }
    , function(error) {
      errorFn(error);
    }
  );
}

/*****************************
 ***** TABLE DESCRIPTION *****
 *****************************/

function showFieldsForObject() {
  show("table-description-wrapper");
  hide("data-entry-wrapper");
  hide("data-view-wrapper");
  var el = getObject("table-description");
  var html = "";

  getObjectDescription(
    REALM_OBJECT_NAME_DEPARTMENTS
    , function(departmentDescription) {
        html += descriptionToHtml(departmentDescription);
        html += "<hr/>"

        getObjectDescription(
          REALM_OBJECT_NAME_EMPLOYEES
          , function(employeeDescription) {
              html += descriptionToHtml(employeeDescription);
              html += "<hr/>"

              getObjectDescription(
                REALM_OBJECT_NAME_DOCUMENTS
                , function(documentsDescription) {
                    html += descriptionToHtml(documentsDescription);
                    el.innerHTML = html;
              });
        });
  });
}

function descriptionToHtml(description) {
    var html = "";
    html += "<div>Name: " + description.name + "</div>";
    if(description.index != null && typeof(description.index) != "undefined") {
      html += "<div>Index: " + description.index + "</div>";
    }

    html += "<div>Fields</div>";
    if(typeof(description.fields) != "undefined") {
      for(var i = 0; i<description.fields.length; i++) {
        var pk = (typeof(description.key) != "undefined" && description.key == description.fields[i].name);
        html += ((pk) ? "<div class='pk'>" : "<div>")+description.fields[i].name + " : " + description.fields[i].type + "</div>";
      }
    }

    return html;
}

function getObjectDescription(objectName, success) {
  var realm = getRealmController();
  realm.describeObject(
    objectName
    , function(description) {
      success(description);
    }
    , function(error) {
      out(error);
    }
  )
}
