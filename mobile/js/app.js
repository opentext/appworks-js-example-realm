// Register the deviceready event, called when cordova/appworks is ready to start working with the appworks API
document.addEventListener("deviceready", onDeviceReady, false);
var self = this;
var REALM_OBJECT_NAME_EMPLOYEES = "employees";
var REALM_OBJECT_NAME_DEPARTMENTS = "departments";
var REALM_OBJECT_NAME_DOCUMENTS = "documents";

// A global instances of the Apworks.AWRealm. We only want one.
self.realmController = null;
self.sortDirection = "asc";
self.sortField = "";

self.departments = [];
self.employeeDocuments = [];

/**
 * Called when AppWorks is ready
 */
function onDeviceReady() {
  initializeRealmObjects();
}

/**
 * Get the global realm instance, we only want one for our app.
 */
function getRealmController(callback) {
  if(self.realmController == null) {
    self.realmController = new Appworks.AWRealm();
    self.realmController.startRealm(
      function() {
        out("Realm started");
        callback(self.realmController);
      }
      , function (error) {
        out(error);
        callback(null);
      }
    );
  } else {
    callback(self.realmController);
  }
}

/**********************
 ***** DATA ENTRY *****
 **********************/

function showDataEntry() {
  hide("table-description-wrapper");
  show("data-entry-wrapper");
  hide("data-view-wrapper");
}

/**
 * Realm insert function
 */
function insert(object, data, successFn, errorFn) {
  getRealmController(function (realm) {
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
  });
}

/**
 * Realm update function
 */
function update(object, data, query, successFn, errorFn) {
  getRealmController(function (realm) {
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
  });
}

/**
 * Realm remove function
 */
function remove(object, query, success, errorFn) {
  getRealmController(function (realm) {
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
  });
}

/**************************
 ***** DATA SELECTION *****
 **************************/

function showDataView() {
  hide("table-description-wrapper");
  hide("data-entry-wrapper");
  show("data-view-wrapper");
}

/**
 * Perform the realm select
 */
function select(object, query, sort, successFn, errorFn) {
  getRealmController(function (realm) {
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
  });
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
