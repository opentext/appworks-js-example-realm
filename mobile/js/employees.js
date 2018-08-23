/**********************
 ***** DATA ENTRY *****
 **********************/

function showDataEntryEmployee() {
  hide("data-entry-department");
  show("data-entry-employee");
  hide("data-entry-document");

  populateDocuments();
}

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
 *
 */
function populateDocuments() {
  getRealmController(function (realm) {
    var el = getObject("document-checkbox-wrapper");
    el.innerHTML = "";

    self.sortDirection = realm.QUERY_SORT_ASC;
    self.sortField = "title";
    selectAllDocuments(function(results) {
      for(var i=0; i<results.length; i++) {
        var div = document.createElement("div");
        var label = document.createElement("label");
        label.class = "form-check-label";

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.class = "form-check-input";
        checkbox.name = "field-documents[]";
        checkbox.value = results[i].id;

        for(var j=0; j<self.employeeDocuments.length; j++) {
          if(results[i].id == self.employeeDocuments[j].id) {
            checkbox.checked = true;
          }
        }

        el.appendChild(div);
        div.appendChild(label);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + results[i].title));

      }
      self.employeeDocuments.length = [];
    });
  });
}

function getSelectedDocuments() {
  var arr = [];
  var checkboxes = document.getElementsByName("field-documents[]");
  for(var i = 0; i<checkboxes.length; i++) {
    if(checkboxes[i].checked) {
      arr.push(checkboxes[i].value);
    }
  }

  return arr;
}

/**
 * Reset the employee input fields
 */
function resetForm() {
  self.employeeDocuments.length = [];
  getObject("field-id").value = "";
  getObject("field-employeeName").value = "";
  getObject("field-contact").value = "";
  getObject("field-region").selectedIndex = -1;
  getObject("field-ability").value = "";
  getObject("field-active").checked = false;
  getObject("field-department").selectedIndex='0';

  show("insert-button");
  hide("update-button");
  hide("delete-button");
}

/**
 * Create an employee
 * Retrive the data object from the employee input fields and place in an object
 * Call the realm insert method
 */
function insertEmployee() {
  getRealmController(function (realm) {
    var employeeName = getObject("field-employeeName").value;
    var contact = getObject("field-contact").value;

    var regionElement = getObject("field-region")
    var region = regionElement.options[regionElement.selectedIndex].value;

    var ability = getObject("field-ability").value;
    var active = getObject("field-active").checked;

    var departmentElement = getObject("field-department")
    var department = departmentElement.options[departmentElement.selectedIndex].value;

    var documents = getSelectedDocuments();

    var departmentObject = {};
    departmentObject[realm.QUERY_OBJECT_NAME] = REALM_OBJECT_NAME_DEPARTMENTS;
    departmentObject[realm.QUERY_FIELD] = "id";
    departmentObject[realm.QUERY_VALUE] = department;

    var documentsObject = {};
    documentsObject[realm.QUERY_OBJECT_NAME] = REALM_OBJECT_NAME_DOCUMENTS;
    documentsObject[realm.QUERY_FIELD] = "id";
    documentsObject[realm.QUERY_VALUE] = documents;

    var employee = {
      "employee"  : employeeName
      , "contact" : contact
      , "region"  : region
      , "ability" : ability
      , "active"  : active
      , "department"  : departmentObject
      , "documents" : documentsObject
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
  });
}

/**
 * Update an employee
 * Retrive the data object from the employee input fields and place in an object
 * Create a query to isolate the realm object to update
 * Call the realm update method
 */
function updateEmployee() {
  getRealmController(function (realm) {
    var id = getObject("field-id").value;

    var employeeName = getObject("field-employeeName").value;
    var contact = getObject("field-contact").value;

    var regionElement = getObject("field-region")
    var region = regionElement.options[regionElement.selectedIndex].value;

    var ability = getObject("field-ability").value;
    var active = getObject("field-active").checked;

    var departmentElement = getObject("field-department")
    var department = departmentElement.options[departmentElement.selectedIndex].value;

    var departmentObject = {};
    departmentObject[realm.QUERY_OBJECT_NAME] = REALM_OBJECT_NAME_DEPARTMENTS;
    departmentObject[realm.QUERY_FIELD] = "id";
    departmentObject[realm.QUERY_VALUE] = department;

    var documents = getSelectedDocuments();
    var documentsObject = {};
    documentsObject[realm.QUERY_OBJECT_NAME] = REALM_OBJECT_NAME_DOCUMENTS;
    documentsObject[realm.QUERY_FIELD] = "id";
    documentsObject[realm.QUERY_VALUE] = documents;

    var employee = {
      "employee"  : employeeName
      , "contact" : contact
      , "region"  : region
      , "ability" : ability
      , "active"  : active
      , "department"  : departmentObject
      , "documents" : documentsObject
    };

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
  });
}

/**
 * Remove an employee
 * Create a query to isolate the realm object to remove
 * Call the realm remove method
 */
function removeEmployee() {
  getRealmController(function (realm) {
    var id = getObject("field-id").value;
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
  });
}

/**************************
 ***** DATA SELECTION *****
 **************************/

function showDataViewEmployee() {
  getRealmController(function (realm) {
    hide("data-view-departments-wrapper");
    show("data-view-employees-wrapper");
    hide("data-view-documents-wrapper");

    selectAllEmployees();
  });
}

/**
 * Select all employees
 */
function selectAllEmployees() {
  getRealmController(function (realm) {
    self.sortDirection = realm.QUERY_SORT_ASC;
    self.sortField = "employee";
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
  });
}

function sortBy(field) {
  getRealmController(function (realm) {
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
  });
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
    getObject("field-department").value = employee.department.id;

    self.employeeDocuments = employee.documents;

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
  getRealmController(function (realm) {
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
  });
}
