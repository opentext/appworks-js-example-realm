/**********************
 ***** DATA ENTRY *****
 **********************/

function showDataEntryDepartment() {
  show("data-entry-department");
  hide("data-entry-employee");
  hide("data-entry-document");
}

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
  * Retrive the data object from the department input fields and place in an object
  * Call the realm insert method
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
 * Retrive the data object from the department input fields and place in an object
 * Create a query to isolate the realm object to update
 * Call the realm update method
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
 * Call the realm remove method
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

/**************************
 ***** DATA SELECTION *****
 **************************/

function showDataViewDepartment() {
  show("data-view-departments-wrapper");
  hide("data-view-employees-wrapper");
  hide("data-view-documents-wrapper");

  showDepartments();
}

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
