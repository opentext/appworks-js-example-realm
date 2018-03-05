
// Register the deviceready event, called when cordova/appworks is ready to start working with the appworks API
document.addEventListener("deviceready", onDeviceReady, false);
var self = this;
var REALM_OBJECT_NAME = "employees";

// A global instances of the Apworks.AWNotificationManager. We only want one.
self.realmController = null;

/**
 * Called when AppWorks is ready
 */
function onDeviceReady() {
  initializeRealmObjects();
}

/**
 * Get the global notification manager instance, we only want one for our app.
 */
function getRealmController() {
  if(self.realmController == null) {
    self.realmController = new Appworks.AWRealm();
    self.realmController.startRealm(
      function() {
        out("Realm started");
      }
      , function (error) {
        out(error);
      }
    );
  }
  return self.realmController;
}


/**************************
 ***** TABLE CREATION *****
 **************************/

function initializeRealmObjects() {
  createTableObject();
}

/**
 * Realm table creation
 */
function createTableObject() {
  var realm = getRealmController();

  // Check if the table exists
  realm.objectExists(REALM_OBJECT_NAME, function (exists) {
    if(!exists) {
      // Table doesn't exist, create it
      realm.createObject(REALM_OBJECT_NAME, function() {
        // Table created, add the fields
        addFields();
      }, function(error) {
        out(error);
      });
    };
  }, function(error) {
    out(error);
  });
}

/**
 * Realm table field addition
 */
function addFields() {
  var realm = getRealmController();
  var fields = [
    {"name":"id", "type":"STRING", "key":true}
    , {"name":"employee", "type":"STRING"}
    , {"name":"contact", "type":"STRING"}
    , {"name":"region", "type":"STRING"}
    , {"name":"ability", "type":"INTEGER"}
    , {"name":"active", "type":"BOOLEAN"}
  ];

  realm.addFields(
    REALM_OBJECT_NAME
    , fields
    , function(description) {
      out("Realm table setup complete");
    }
    , function(error) {
      out(error);
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

  getObjectDescription(
    REALM_OBJECT_NAME
    , function(description) {
        var html = "";
        html += "<div>Name: " + description.name + "</div>";

        if(typeof(description.fields) != "undefined") {
          for(var i = 0; i<description.fields.length; i++) {
            var pk = (typeof(description.key) != "undefined" && description.key == description.fields[i].name);
            html += ((pk) ? "<div class='pk'>" : "<div>")+description.fields[i].name + " : " + description.fields[i].type + "</div>";
          }
        }

        el.innerHTML = html;
  });
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


/**********************
 ***** DATA ENTRY *****
 **********************/

function showDataEntry() {
  hide("table-description-wrapper");
  show("data-entry-wrapper");
  hide("data-view-wrapper");
}

function resetForm() {
  getObject("field-id").value = "";
  getObject("field-employeeName").value = "";
  getObject("field-contact").value = "";
  getObject("field-region").selectedIndex = -1;
  getObject("field-ability").value = "";
  getObject("field-active").checked = false;

  show("insert-button");
  hide("update-button");
  hide("delete-button");
}

function insert() {
  var employeeName = getObject("field-employeeName").value;
  var contact = getObject("field-contact").value;

  var regionElement = getObject("field-region")
  var region = regionElement.options[regionElement.selectedIndex].value;

  var ability = getObject("field-ability").value;
  var active = getObject("field-active").checked;

  insertEmployee(employeeName, contact, region, ability, active);
  resetForm();
}

function insertEmployee(employeeName, contact, region, ability, active) {
  var realm = getRealmController();
  var employee = {
    "employee"  : employeeName
    , "contact" : contact
    , "region"  : region
    , "ability" : ability
    , "active"  : active
  };

  realm.insert(
    REALM_OBJECT_NAME
    , employee
    , function() {
      // refresh view
      showDataView();
    }
    , function(error) {
      out(error);
    }
  );
}

function update() {
  var id = getObject("field-id").value;

  var employeeName = getObject("field-employeeName").value;
  var contact = getObject("field-contact").value;

  var regionElement = getObject("field-region")
  var region = regionElement.options[regionElement.selectedIndex].value;

  var ability = getObject("field-ability").value;
  var active = getObject("field-active").checked;

  updateEmployee(id, employeeName, contact, region, ability, active);
  resetForm();
}

function updateEmployee(id, employeeName, contact, region, ability, active) {
  var realm = getRealmController();
  var query = realm.queryBuilder.equalTo("id",id).done();
  var employee = {
    "employee"  : employeeName
    , "contact" : contact
    , "region"  : region
    , "ability" : ability
    , "active"  : active
  };

  realm.update(
    REALM_OBJECT_NAME
    , employee
    , query
    , function() {
        showDataView();
    }
    , function(error) {
      out(error);
    }
  );
}

function remove() {
  var id = getObject("field-id").value;
  removeEmployee(id);
}

function removeEmployee(id) {
  var realm = getRealmController();
  var query = realm.queryBuilder.equalTo("id",id).done();
  realm.remove(
    REALM_OBJECT_NAME
    , query
    , function() {
        showDataView();
    }
    , function(error) {
      out(error);
    }
  );
}

/**************************
 ***** DATA SELECTION *****
 **************************/

function showDataView() {
  hide("table-description-wrapper");
  hide("data-entry-wrapper");
  show("data-view-wrapper");

  selectAllEmployees();
}

/**
 * Select all employees
 */
function selectAllEmployees() {
  var realm = getRealmController();
  var query = realm.queryBuilder.done();
  select(
    query
    , function(results) {
      outputEmployees(results);
  });
}

function outputEmployees(employees) {
  var el = getObject("data-view");
  var html = "";
  html += "<table class='table'>";
  html += "<thead>";
  html += "  <tr>";
  html += "    <th>Employee Name</th>";
  html += "    <th>Ability</th>";
  html += "  </tr>";
  html += "</thead>";
  html += "<tbody>";

  for(var i=0; i<employees.length; i++) {
    var trClass = 'active-employee';
    if(!employees[i].active) {
      trClass = 'inactive-employee';
    }
    var clickEvent = "showEmployee(\""+employees[i].id+"\")";
    html += "  <tr class='"+trClass+"' onclick='"+clickEvent+"'>";
    html += "    <td>"+employees[i].employee+"</td>";
    html += "    <td>"+employees[i].ability+"</td>";
    html += "  </tr>";
  }

  html += "</tbody>";
  html += "</table>";

  el.innerHTML = html;
}

function showEmployee(id) {
  selectEmployee(id, function(employee) {
    getObject("field-id").value = employee.id;
    getObject("field-employeeName").value = employee.employee;
    getObject("field-contact").value = employee.contact;
    getObject("field-region").value = employee.region;
    getObject("field-ability").value = employee.ability;
    getObject("field-active").checked = employee.active;

    hide("insert-button");
    show("update-button");
    show("delete-button");
    showDataEntry();
  });
}
/**
 * Select by employee
 */
function selectEmployee(id, success) {
  var realm = getRealmController();
  var query = realm.queryBuilder.equalTo("id",id).done();
  select(
    query
    , function(result) {
      success(result[0]);
  });
}

/**
 * Perform the realm select
 */
function select(query, success) {
  var realm = getRealmController();
  realm.select(
    REALM_OBJECT_NAME
    , query
    , function(result) {
      success(result);
    }
    , function(error) {
      out(error);
    }
  );
}


/***************************
 ***** UTILITY METHODS *****
 ***************************/

/*
 * A helper function to output messages to the results element
 */
function out(message) {
  console.log(message);
  if(typeof(message) == "object") {
    getObject("result").innerHTML = JSON.stringify(message);
  } else {
    getObject("result").innerHTML = message;
  }
}

/*
 * A helper function to get an element by name
 */
function getObject(name) {
  return document.getElementById(name);
}

function show(object) {
  getObject(object).classList.remove("hidden");
}

function hide(object) {
  getObject(object).classList.add("hidden");
}
