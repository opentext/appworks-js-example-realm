/**********************
 ***** DATA ENTRY *****
 **********************/

function showDataEntryDocument() {
  hide("data-entry-department");
  hide("data-entry-employee");
  show("data-entry-document");
}

/**
 * Reset the document input fields
 */
function resetDocumentForm() {
  getObject("field-documentId").value = "";
  getObject("field-documentTitle").value = "";
  getObject("field-documentFilename").value = "";
  getObject("field-documentCreated").value = "N/A";
  getObject("field-documentModified").value = "N/A";

  show("insert-document-button");
  hide("update-document-button");
  hide("delete-document-button");
}

/**
 * Create a document
 * Create the JSON object from the document input fields
 * Call the realm insert method
 */
function insertDocument() {
  var title = getObject("field-documentTitle").value;
  var filename = getObject("field-documentFilename").value;

  // Now datetime
  var now = new Date();
  // Put into the following ISO format: yyyy-MM-dd'T'HH:mm:ss.SSSXXX e.g. 2018-03-12T12:30:15.817Z
  var created = now.toISOString();
  var modified = now.toISOString();

  var documentObject = {
    "title"  : title
    , "filename" : filename
    , "created"  : created
    , "modified" : modified
  };

  insert(
    REALM_OBJECT_NAME_DOCUMENTS
    , documentObject
    , function() {
      resetDocumentForm();
      showDataView();
      showDataViewDocument();
    }
    , function(error) {
      out(error);
    }
  );
}

/**
 * Update a document
 * Retrive the data object from the document input fields and place in an object
 * Create a query to isolate the realm object to update
 * Call the realm update method
 */
function updateDocument() {
  getRealmController(function (realm) {
    var id = getObject("field-documentId").value;

    var title = getObject("field-documentTitle").value;
    var filename = getObject("field-documentFilename").value;

    // Now datetime
    var now = new Date();
    // Put into the following ISO format: yyyy-MM-dd'T'HH:mm:ss.SSSXXX e.g. 2018-03-12T12:30:15.817Z
    var modified = now.toISOString();

    var documentObject = {
      "title"  : title
      , "filename" : filename
      , "modified" : modified
    };

    var query = realm.queryBuilder.equalTo("id",id).done();

    update(
      REALM_OBJECT_NAME_DOCUMENTS
      , documentObject
      , query
      , function() {
        resetForm();
        showDataView();
        showDataViewDocument();
      }
      , function (error) {
        out(error);
      });
  });
}

/**
 * Remove a document
 * Create a query to isolate the realm object to remove
 * Call the realm remove method
 */
function removeDocument() {
  getRealmController(function (realm) {
    var id = getObject("field-documentId").value;
    var query = realm.queryBuilder.equalTo("id",id).done();

    remove(
      REALM_OBJECT_NAME_DOCUMENTS
      , query
      , function() {
        resetForm();
        showDataView();
        showDataViewDocument();
      }
      , function (error) {
        out(error);
      });
  });
}

/**************************
 ***** DATA SELECTION *****
 **************************/

function showDataViewDocument() {
  getRealmController(function (realm) {
    hide("data-view-departments-wrapper");
    hide("data-view-employees-wrapper");
    show("data-view-documents-wrapper");

    self.sortDirection = realm.QUERY_SORT_ASC;
    self.sortField = "title";
    refreshDocumentsView();
  });
}

function refreshDocumentsView() {
  selectAllDocuments(function(results) {
    outputDocuments(results);
  });
}

/**
 * Select all documents
 */
function selectAllDocuments(success) {
  getRealmController(function (realm) {
    var query = realm.queryBuilder.done();
    sort = {};
    sort[realm.QUERY_FIELD] = self.sortField;
    sort[realm.QUERY_SORT] = self.sortDirection;
    select(
      REALM_OBJECT_NAME_DOCUMENTS
      , query
      , sort
      , function(results) {
        success(results);
      }
      , function (error) {
        out(error);
      });
    });
}

function sortDocumentBy(field) {
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

    refreshDocumentsView();
  });
}

function outputDocuments(documents) {
  var el = getObject("data-view-documents");
  var html = "";
  html += "<table class='table'>";
  html += "<thead>";
  html += "  <tr>";
  html += '    <th onclick=\'sortDocumentBy("title")\'>Title</th>';
  html += '    <th onclick=\'sortDocumentBy("filename")\'>Filename</th>';
  html += "  </tr>";
  html += "</thead>";
  html += "<tbody>";

  for(var i=0; i<documents.length; i++) {
    var clickEvent = "showDocument(\""+documents[i].id+"\")";
    html += "  <tr onclick='"+clickEvent+"'>";
    html += "    <td>"+documents[i].title+"</td>";
    html += "    <td>"+documents[i].filename+"</td>";
    html += "  </tr>";
  }

  html += "</tbody>";
  html += "</table>";

  el.innerHTML = html;
}

function showDocument(id) {
  selectDocument(id, function(document) {
    getObject("field-documentId").value = document.id;
    getObject("field-documentTitle").value = document.title;
    getObject("field-documentFilename").value = document.filename;
    getObject("field-documentCreated").value = document.created;
    getObject("field-documentModified").value = document.modified;

    hide("insert-document-button");
    show("update-document-button");
    show("delete-document-button");
    showDataEntry();
    showDataEntryDocument();
  });
}
/**
 * Select by document
 */
function selectDocument(id, success) {
  getRealmController(function (realm) {
    var query = realm.queryBuilder.equalTo("id",id).done();
    var sort = null;
    select(
      REALM_OBJECT_NAME_DOCUMENTS
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
