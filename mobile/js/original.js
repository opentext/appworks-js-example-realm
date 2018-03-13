
// Register the deviceready event, called when cordova/appworks is ready to start working with the appworks API
document.addEventListener("deviceready", onDeviceReady, false);
var self = this;
var REALM_OBJECT_NAME_EMPLOYEES = "employees";
var REALM_OBJECT_NAME_DEPARTMENTS = "departments";

// A global instances of the Apworks.AWRealm. We only want one.
self.realmController = null;
self.sortDirection = "asc";
self.sortField = "employee";

self.departments = [];

/**
 * Called when AppWorks is ready
 */
function onDeviceReady() {
  initializeRealmObjects();
}

/**
 * Get the global realm instance, we only want one for our app.
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

/**********************
 ***** DATA ENTRY *****
 **********************/

function showDataEntry() {
  hide("table-description-wrapper");
  show("data-entry-wrapper");
  hide("data-view-wrapper");
}

function showDataEntryDepartment() {
  show("data-entry-department");
  hide("data-entry-employee");
}

function showDataEntryEmployee() {
  hide("data-entry-department");
  show("data-entry-employee");
}

/*************************
 * Department Data Entry *
 *************************/

/**
 * Reset the department input fields
 */
 function resetDepartmentForm() {
   getObject("field-departmentId").value = "";
   getObject("field-departmentName").value = "";

   show("insert-department-button");
   hide("update-department-button");
   hide("delete-department-button");
 }

 /**
  * Create a department
  * Retrive the data object from the employee input fields and place in an object
  * Call the ream insert method
  */
function insertDepartment() {
  var departmentName = getObject("field-departmentName").value;
  var realm = getRealmController();
  var department = {
    "name"  : departmentName
  };

  insert(
    REALM_OBJECT_NAME_DEPARTMENTS
    , department
    , function() {
      setGlobalDepartments(function(){
        resetDepartmentForm();
        showDataView();
        showDataViewDepartment()
      });
    }
    , function(error) {
      out(error);
    }
  );
}

/**
 * Update a department
 * Retrive the data object from the employee input fields and place in an object
 * Create a query to isolate the realm object to update
 * Call the ream update method
 */
function updateDepartment() {
  var realm = getRealmController();
  var id = getObject("field-departmentId").value;
  var query = realm.queryBuilder.equalTo("id",id).done();

  var departmentName = getObject("field-departmentName").value;
  var department = {
   "name"  : departmentName
  };

  update(
    REALM_OBJECT_NAME_DEPARTMENTS
    , department
    , query
    , function() {
      setGlobalDepartments(function(){
        resetDepartmentForm();
        showDataView();
        showDataViewDepartment()
      });
    }
    , function (error) {
      out(error);
  });
}

/**
 * Remove a department
 * Create a query to isolate the realm object to remove
 * Call the ream remove method
 */
function removeDepartment() {
  var realm = getRealmController();
  var id = getObject("field-departmentId").value;
  var query = realm.queryBuilder.equalTo("id",id).done();

  remove(
    REALM_OBJECT_NAME_DEPARTMENTS
    , query
    , function() {
      setGlobalDepartments(function(){
        resetDepartmentForm();
        showDataView();
        showDataViewDepartment()
      });
    }
    , function (error) {
      out(error);
    });
}

/*************************
 * Employee Data Entry *
 *************************/

/**
 *
 */
function populateDepartment() {
  var select = getObject("field-department");
  for(var i = select.options.length - 1 ; i >= 0 ; i--) {
    select.remove(i);
  }

  for(var i=0; i<self.departments.length; i++) {
    var option = document.createElement("option");
    option.text = self.departments[i].name;
    option.value = self.departments[i].id;
    select.add(option);
  }
}

/**
 * Reset the employee input fields
 */
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

/**
 * Create an employee
 * Retrive the data object from the employee input fields and place in an object
 * Call the ream insert method
 */
function insertEmployee() {
  var employeeName = getObject("field-employeeName").value;
  var contact = getObject("field-contact").value;

  var regionElement = getObject("field-region")
  var region = regionElement.options[regionElement.selectedIndex].value;

  var ability = getObject("field-ability").value;
  var active = getObject("field-active").checked;

  var departmentElement = getObject("field-department")
  var department = departmentElement.options[departmentElement.selectedIndex].value;

  var realm = getRealmController();
  var departmentObject = {};
  departmentObject[realm.QUERY_OBJECT_NAME] = REALM_OBJECT_NAME_DEPARTMENTS;
  departmentObject[realm.QUERY_FIELD] = "id";
  departmentObject[realm.QUERY_VALUE] = department;

  var employee = {
    "employee"  : employeeName
    , "contact" : contact
    , "region"  : region
    , "ability" : ability
    , "active"  : active
    , "department"  : departmentObject
  };

  insert(
    REALM_OBJECT_NAME_EMPLOYEES
    , employee
    , function() {
      resetForm();
      showDataView();
      showDataViewEmployee();
    }
    , function(error) {
      out(error);
    }
  );
}

/**
 * Update an employee
 * Retrive the data object from the employee input fields and place in an object
 * Create a query to isolate the realm object to update
 * Call the ream update method
 */
function updateEmployee() {
  var id = getObject("field-id").value;

  var employeeName = getObject("field-employeeName").value;
  var contact = getObject("field-contact").value;

  var regionElement = getObject("field-region")
  var region = regionElement.options[regionElement.selectedIndex].value;

  var ability = getObject("field-ability").value;
  var active = getObject("field-active").checked;

  var realm = getRealmController();
  var departmentObject = {};
  departmentObject[realm.QUERY_OBJECT_NAME] = REALM_OBJECT_NAME_DEPARTMENTS;
  departmentObject[realm.QUERY_FIELD] = "id";
  departmentObject[realm.QUERY_VALUE] = department;

  var employee = {
    "employee"  : employeeName
    , "contact" : contact
    , "region"  : region
    , "ability" : ability
    , "active"  : active
    , "department"  : departmentObject
  };

  var realm = getRealmController();
  var query = realm.queryBuilder.equalTo("id",id).done();

  update(
    REALM_OBJECT_NAME_EMPLOYEES
    , employee
    , query
    , function() {
      resetForm();
      showDataView();
      showDataViewEmployee();
    }
    , function (error) {
      out(error);
    });
}

/**
 * Remove an employee
 * Create a query to isolate the realm object to remove
 * Call the ream remove method
 */
function removeEmployee() {
  var id = getObject("field-id").value;
  var realm = getRealmController();
  var query = realm.queryBuilder.equalTo("id",id).done();

  remove(
    REALM_OBJECT_NAME_EMPLOYEES
    , query
    , function() {
      resetForm();
      showDataView();
      showDataViewEmployee();
    }
    , function (error) {
      out(error);
    });
}

/**
 * Realm insert function
 */
function insert(object, data, successFn, errorFn) {
  var realm = getRealmController();
  realm.insert(
    object
    , data
    , function() {
      successFn()
    }
    , function(error) {
      errorFn(error);
    }
  );
}

/**
 * Realm update function
 */
function update(object, data, query, successFn, errorFn) {
  var realm = getRealmController();
  realm.update(
    object
    , data
    , query
    , function() {
      successFn();
    }
    , function(error) {
      errorFn(error);
    }
  );
}

/**
 * Realm remove function
 */
function remove(object, query, success, errorFn) {
  var realm = getRealmController();
  realm.remove(
    object
    , query
    , function() {
      successFn();
    }
    , function(error) {
      errorFn(error);
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
}

function showDataViewDepartment() {
  show("data-view-departments-wrapper");
  hide("data-view-employees-wrapper");

  showDepartments();
}

function showDataViewEmployee() {
  hide("data-view-departments-wrapper");
  show("data-view-employees-wrapper");

  var realm = getRealmController();
  self.sortDirection = realm.QUERY_SORT_ASC;
  self.sortField = "employee";
  selectAllEmployees();
}

/***********************
* Department Selection *
***********************/

/**
* Set global departments
*/
function setGlobalDepartments(successFn) {
 selectAllDepartments(
   function(departments) {
     self.departments = departments;
     populateDepartment();
     successFn();
   }
   , function(error) {
     out(error);
   }
 );
}

/**
* Select all departments
*/
function selectAllDepartments(successFn, errorFn) {
 var realm = getRealmController();
 var query = realm.queryBuilder.done();
 sort = {};
 sort[realm.QUERY_FIELD] = "name";
 sort[realm.QUERY_SORT] = realm.QUERY_SORT_ASC;
 select(
   REALM_OBJECT_NAME_DEPARTMENTS
   , query
   , sort
   , function(results) {
     successFn(results);
   }
   , function(error) {
     errorFn(error);
   }
 );
}

function refreshDepartmentsView() {
  setGlobalDepartments(function() {
    showDepartments();
  });
}

function showDepartments() {
  var el = getObject("data-view-departments");
  var html = "";
  html += "<table class='table'>";
  html += "<thead>";
  html += "  <tr>";
  html += '    <th>Department Name</th>';
  html += "  </tr>";
  html += "</thead>";
  html += "<tbody>";

  for(var i=0; i<self.departments.length; i++) {
    var clickEvent = "showDepartment(\""+self.departments[i].id+"\", \""+self.departments[i].name+"\")";
    html += "  <tr onclick='"+clickEvent+"'>";
    html += "    <td>"+self.departments[i].name+"</td>";
    html += "  </tr>";
  }

  html += "</tbody>";
  html += "</table>";

  el.innerHTML = html;
}

function showDepartment(id, name) {
  getObject("field-departmentId").value = id;
  getObject("field-departmentName").value = name;

  hide("insert-department-button");
  show("update-department-button");
  show("delete-department-button");
  showDataEntry();
  showDataEntryDepartment();
}

/*********************
* Employee Selection *
**********************/

/**
 * Select all employees
 */
function selectAllEmployees() {
  var realm = getRealmController();
  var query = realm.queryBuilder.done();
  sort = {};
  sort[realm.QUERY_FIELD] = self.sortField;
  sort[realm.QUERY_SORT] = self.sortDirection;
  select(
    REALM_OBJECT_NAME_EMPLOYEES
    , query
    , sort
    , function(results) {
      outputEmployees(results);
    }
    , function (error) {
      out(error);
    });
}

function sortBy(field) {
  var realm = getRealmController();
  if(self.sortField == field) {
    if(self.sortDirection == realm.QUERY_SORT_DESC) {
      self.sortDirection = realm.QUERY_SORT_ASC;
    } else {
      self.sortDirection = realm.QUERY_SORT_DESC;
    }
  } else {
    self.sortDirection = realm.QUERY_SORT_ASC;
  }
  self.sortField = field;

  selectAllEmployees();
}

function outputEmployees(employees) {
  var el = getObject("data-view-employees");
  var html = "";
  html += "<table class='table'>";
  html += "<thead>";
  html += "  <tr>";
  html += '    <th onclick=\'sortBy("employee")\'>Employee Name</th>';
  html += '    <th onclick=\'sortBy("ability")\'>Ability</th>';
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
    showDataEntryEmployee();
  });
}
/**
 * Select by employee
 */
function selectEmployee(id, success) {
  var realm = getRealmController();
  var query = realm.queryBuilder.equalTo("id",id).done();
  var sort = null;
  select(
    REALM_OBJECT_NAME_EMPLOYEES
    , query
    , null
    , function(result) {
      success(result[0]);
    }
    , function (error) {
      out(error);
    }
  );
}

/**
 * Perform the realm select
 */
function select(object, query, sort, successFn, errorFn) {
  var realm = getRealmController();
  realm.select(
    object
    , query
    , sort
    , function(result) {
      successFn(result);
    }
    , function(error) {
      errorFn(error);
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
