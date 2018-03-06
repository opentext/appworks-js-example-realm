# AppWorks Example - Realm

## Contents
1. [About appworks.js](#about-appworksjs)
2. [About this example app](#about-this-example)
3. [Usage](#usage)
4. [Installation](#installation)

## About appworks.js

appworks.js is a javascript (TypeScript) library for building feature rich, hybrid enterprise apps. The OpenText AppWorks platform provides mobile and desktop clients that support apps that utilize appworks.js.

In a mobile environment the library provides access to on-device technology, and in the desktop environment some features of the underlying host OS (operating system) are exposed.

For more information, see the appworks.js repository: https://github.com/opentext/appworks-js

## About this example

The purpose of the Realm plugin is to provide an interface to your apps Realm database instance, where you may create tables, add fields, insert data, update data, delete data and select data.

## Usage

#### startRealm

```javascript
startRealm(successHandler: any, errorHandler: any)
```

If you wish to use Realm in your app, this is the first call you need to make with the Realm plugin.
This starts up your apps Realm instance. Without calling this, you cannot use Realm.

+ __successHandler__: a callback function that will be called when your apps Realm instance is successfully started.
+ __errorHandler__: a callback function that will be called when your apps Realm instance fails to start.

Examples
```javascript
var self = this;
self.realmController = new Appworks.AWRealm();
self.realmController.startRealm(
  function() {
    console.log("Realm started");
  }
  , function (error) {
    console.log(error);
  }
);
```

#### getAllObjectNames

```javascript
getAllObjectNames(successHandler: any, errorHandler: any)
```

Returns an array of strings containing the names of all the object/tables in your apps Realm instance.

+ __successHandler__: Returns an array contains the names of all objects/tables in your Realm instance.
+ __errorHandler__: Returns an error string

Examples
```javascript
self.realmController.getAllObjectNames(
  function(objectNames) {
    for(var i=0; i<objectNames.length; i++) {
      console.log(objectNames[i]);
    }
  }
  , function (error) {
    console.log(error);
  }
);
```

#### objectExists

```javascript
objectExists(objectName: string, successHandler: any, errorHandler: any)
```

Determine whether an object/table exists in your Realm instance.

+ __objectName__: The name of the table
+ __successHandler__: Returns a boolean value where true = object exists, false = object does not exist.
+ __errorHandler__: Returns an error string

Examples
```javascript
self.realmController.objectExists(
  "my_table"
  , function(exists) {
    if(exists) {
      console.log("Object exists");
    } else {
      console.log("Object does not exist");
      // Create object
    }
  }
  , function (error) {
    console.log(error);
  }
);
```

#### createObject

```javascript
createObject(objectName: string, successHandler: any, errorHandler: any)
```

Create an object/table in your apps Realm instance.

+ __objectName__: The name of the table
+ __successHandler__: Returns if successful
+ __errorHandler__: Returns an error string

Examples
```javascript
self.realmController.createObject(
  "my_table"
  , function() {
    console.log("Object created successfully");
  }
  , function (error) {
    console.log(error);
  }
);
```

#### addField

```javascript
addField(objectName: string, field: object, successHandler: any, errorHandler: any)
```

Add an individual field to your table

+ __objectName__: The name of the table
+ __field__: An object describing the field: {"name":"name_of_field", "type":"STRING"}
+ __successHandler__: Returns if successful
+ __errorHandler__: Returns an error string

Examples
```javascript
var field = {};
field[self.realmController.FIELD_OBJECT_NAME] = "my_field";
field[self.realmController.FIELD_OBJECT_TYPE] = self.realmController.FIELD_TYPE_STRING;

// or: var field = {"name":"my_field", "type":"STRING"};
// or a primary key: var field = {"name":"my_id", "type":"STRING", "key":true};

self.realmController.addField(
  "my_table"
  , field
  , function() {
    console.log("Field added successfully");
  }
  , function (error) {
    console.log(error);
  }
);
```

#### addFields

```javascript
addFields(objectName: string, field: Array<object>, successHandler: any, errorHandler: any)
```

Add multiple field to your table

+ __objectName__: The name of the table
+ __fields__: An array of object describing fields: [{"name":"name_of_field", "type":"STRING"}]
+ __successHandler__: Returns if successful
+ __errorHandler__: Returns an error string

Examples
```javascript
var fields = [
  {"name":"id", "type":"STRING", "key":true}
  , {"name":"employee", "type":"STRING"}
  , {"name":"contact", "type":"STRING"}
  , {"name":"region", "type":"STRING"}
  , {"name":"ability", "type":"INTEGER"}
  , {"name":"active", "type":"BOOLEAN"}
];

self.realmController.addFields(
  "my_table"
  , fields
  , function() {
    console.log("Fields added successfully");
  }
  , function (error) {
    console.log(error);
  }
);
```

#### describeObject

```javascript
describeObject(objectName: string, successHandler: any, errorHandler: any)
```

Receive a JSON object representation of your table

+ __objectName__: The name of the table
+ __successHandler__: Returns with the object description
+ __errorHandler__: Returns an error string

Examples
```javascript
self.realmController.describeObject(
  "my_table"
  , function(description) {
    var html = "";
    // Name of table
    html += "<div>Name: " + description.name + "</div>";

    // Does the table have a primary key?
    var pk = (description.key != null && typeof(description.key) != "undefined") ? description.key : "";

    // Does the table have fields?
    if(typeof(description.fields) != "undefined") {
      // description.fields is an array of field objects
      for(var i = 0; i<description.fields.length; i++) {
        // Check if field.name is the primary key, give this div a class to highlight it.
        html += ((pk == description.fields[i].name) ? "<div class='pk'>" : "<div>");
        // Write out the field.name and field.type (data type)
        html += description.fields[i].name + " : " + description.fields[i].type + "</div>";
      }
    }

    // Output the HTML markup of the table description
    document.getElementById("table-description").innerHTML = html;
  }
  , function (error) {
    console.log(error);
  }
);
```

#### objectHasField

```javascript
objectHasField(objectName: string, fieldName: string, successHandler: any, errorHandler: any)
```

Determine whether an object/table has a certain field.

+ __objectName__: The name of the table
+ __fieldName__: The name of the field
+ __successHandler__: Returns a boolean value where true = field exists, false = field does not exist.
+ __errorHandler__: Returns an error string

Examples
```javascript
self.realmController.objectHasField(
  "my_table"
  , "my_field"
  , function(exists) {
    if(exists) {
      console.log("Field exists");
    } else {
      console.log("Field does not exist");
      // Add field
    }
  }
  , function (error) {
    console.log(error);
  }
);
```

#### insert

```javascript
insert(objectName: string, dataObject: object, successHandler: any, errorHandler: any)
```

Insert a JSON object into a table using {field : value, field2 : value2} object

+ __objectName__: The name of the table
+ __dataObject__: The data JSON object to be inserted into the table
+ __successHandler__: Returns if successful
+ __errorHandler__: Returns an error string

Examples
```javascript

// {Fields : Values}
// Fields should exist in the table
// Value data types should match data type of the fields
var dataObject = {
  "employee"  : "John Smith"
  , "contact" : 555123456
  , "region"  : "EMEA"
  , "ability" : 10
  , "active"  : true
};

self.realmController.insert(
  "my_table"
  , dataObject
  , function() {
    console.log("Insert was successful");
  }
  , function (error) {
    console.log(error);
  }
);
```

#### select

```javascript
select(objectName: string, queryArray: Array<object>, sort: object, successHandler: any, errorHandler: any)
```

Select an array of JSON objects from the table using a query array. Add sorting if required.

+ __objectName__: The name of the table
+ __queryArray__: An array of JSON objects containing query type, field and value [{"type":"startsWith", "field":"my_field", "value":"abc"}]
+ __sort__: An object containing the field name to sort by and direction to sort {"field":"my_field", "sort":"asc"}
+ __successHandler__: Returns an array of JSON objects representing each row in the query result
+ __errorHandler__: Returns an error string

Examples
```javascript
// More on queryBuilder later
var queryArray = self.realmController.queryBuilder.startsWith("employee","John").done();

// Add sorting
var sort = {};
sort[self.realmController.QUERY_FIELD] = "employee";
// Sort ascending
sort[self.realmController.QUERY_SORT] = self.realmController.QUERY_SORT_ASC;
// Sort descending
// sort[self.realmController.QUERY_SORT] = self.realmController.QUERY_SORT_DESC;

// sort can also be null for no sorting
// var sort = null;

self.realmController.select(
  "my_table"
  , queryArray
  , sort
  , function(employees) {
      var html = "";
      // Create table and header row
      html += "<table class='table'>";
      html += "<thead>";
      html += "  <tr>";
      html += '    <th>Employee Name</th>';
      html += '    <th>Ability</th>';
      html += "  </tr>";
      html += "</thead>";
      html += "<tbody>";

      // Iterate over each result, which will be a JSON object of {field:value, field2:value2}
      for(var i=0; i<employees.length; i++) {
        var trClass = 'active-employee';
        if(!employees[i].active) {
          trClass = 'inactive-employee';
        }
        html += "  <tr class='"+trClass+"'>";
        html += "    <td>"+employees[i].employee+"</td>";
        html += "    <td>"+employees[i].ability+"</td>";
        html += "  </tr>";
      }

      // Close table
      html += "</tbody>";
      html += "</table>";

      document.getElementById("employee-wrapper").innerHTML = html;
  }
  , function (error) {
    console.log(error);
  }
);
```

#### update

```javascript
update(objectName: string, dataObject: object, queryArray: Array<object>, successHandler: any, errorHandler: any)
```

Update rows in a table by using a select query to isolate the rows, and updating them with a values from a data object.
This is a combination of select (queryArray) and insert (dataObject) statements.

+ __objectName__: The name of the table
+ __dataObject__: The data JSON object to be updated
+ __queryArray__: An array of JSON objects containing query type, field and value [{"type":"equalTo", "field":"id", "value":"unique-guid"}]
+ __successHandler__: Returns if successful
+ __errorHandler__: Returns an error string

Examples
```javascript
// Data object updates
var dataObject = {
  "employee"  : "John Smith"
  , "contact" : 121333444
  , "region"  : "APAC"
  , "ability" : 8
  , "active"  : false
};

// Query rows to update
var queryArray = self.realmController.queryBuilder.equalTo("id","dfg6d-fp37s-jbd3f-iejd8").done();

self.realmController.update(
  "my_table"
  , dataObject
  , queryArray
  , function() {
      console.log("Update was successful");
  }
  , function (error) {
      console.log(error);
  }
);
```

#### remove

```javascript
remove(objectName: string, queryArray: Array<object>, successHandler: any, errorHandler: any)
```

Remove rows from a table by providing a queryArray (same as select and update).

+ __objectName__: The name of the table
+ __queryArray__: An array of JSON objects containing query type, field and value [{"type":"equalTo", "field":"id", "value":"unique-guid"}]
+ __successHandler__: Returns if successful
+ __errorHandler__: Returns an error string

Examples
```javascript
// Query rows to remove
var queryArray = self.realmController.queryBuilder.equalTo("active",false).done();

self.realmController.remove(
  "my_table"
  , queryArray
  , function() {
    console.log("Remove was successful");
  }
  , function (error) {
    console.log(error);
  }
);
```

#### removeAll

```javascript
removeAll(objectName: string, successHandler: any, errorHandler: any)
```

Remove all rows from a table.

+ __objectName__: The name of the table
+ __successHandler__: Returns if successful
+ __errorHandler__: Returns an error string

Examples
```javascript
self.realmController.removeAll(
  "my_table"
  , function() {
    console.log("All rows were successfully removed");
  }
  , function (error) {
    console.log(error);
  }
);
```

#### queryBuilder

```javascript
queryBuilder()
```

This function allows you to build a Realm style query object, by building an array of objects e.g.

JSON example
```javascript
[{"type":"equalTo", "field":"id", "value":"unique-guid"}]
```

You can chain functions to build the array in one go e.g. queryBuilder.equalTo("field1","value1").and().contains("field2","value2").done();
This builds an internal array and returns itself, but by adding .done() at the end, it returns the array itself and clears itself down.

You may also use groups with .beginGroup() and .endGroup(), where the parameters added in between are placed in a sub array, e.g.

Group JSON example
```javascript
[
  [
    {"type":"equalTo", "field":"region", "value":"APAC"}
    , {"type":"and"}
    , {"type":"greaterThan", "field":"ability", "value":7}
  ]
  , {"type":"or"}
  , [
      {"type":"equalTo", "field":"region", "value":"EMEA"}
      , {"type":"and"}
      , {"type":"greaterThan", "field":"ability", "value"8}
    ]
]
```

Examples
```javascript
// Example 1
var realm = self.realmController;
var queryArray = realm.queryBuilder.contains("employee", "smith").and().equalTo("region", "EMEA").and().greaterThan("ability", 7).and().equalTo("active", true).done();
```

```javascript
// Example 2
var realm = self.realmController;
realm.queryBuilder.contains("employee", "smith");
realm.queryBuilder.and().equalTo("region", "EMEA");
realm.queryBuilder.and().greaterThan("ability", 7);
realm.queryBuilder.and().equalTo("active", true);
var queryArray = realm.queryBuilder.done();
```

```javascript
// Example 3
var realm = self.realmController;
realm.queryBuilder.equalTo("region", "APAC");
realm.queryBuilder.or().equalTo("region", "EMEA");
var queryArray = realm.queryBuilder.done();
```

```javascript
// Example 4
var realm = self.realmController;
realm.queryBuilder.beginGroup();
realm.queryBuilder.equalTo("region", "APAC");
realm.queryBuilder.and();
realm.queryBuilder.greaterThan("ability", 7);
realm.queryBuilder.endGroup();
realm.queryBuilder.or();
realm.queryBuilder.beginGroup();
realm.queryBuilder.equalTo("region", "EMEA");
realm.queryBuilder.and();
realm.queryBuilder.greaterThan("ability", 8);
realm.queryBuilder.endGroup();
var queryArray = realm.queryBuilder.done();
```


#### Static strings

```javascript
// Access with this pattern:
var realm = self.realmController;
var stringProperty = realm.FIELD_TYPE_STRING;

/**
 * Properties
 */

// Field object properties
FIELD_OBJECT_NAME = "name";
FIELD_OBJECT_TYPE = "type";
FIELD_OBJECT_PRIMARYKEY = "key";
FIELD_OBJECT_INDEX = "index";

// Object description properties
OBJECT_DESCRIPTION_NAME = "name";
OBJECT_DESCRIPTION_TYPE = "type";
OBJECT_DESCRIPTION_FIELDS = "fields";
OBJECT_DESCRIPTION_KEY = "key";
OBJECT_DESCRIPTION_INDEX = "index";

// Field types
FIELD_TYPE_STRING = "STRING";
FIELD_TYPE_INTEGER = "INTEGER";
FIELD_TYPE_BOOLEAN = "BOOLEAN";
FIELD_TYPE_LONG = "LONG";
FIELD_TYPE_DOUBLE = "DOUBLE";
FIELD_TYPE_FLOAT = "FLOAT";
FIELD_TYPE_BINARY = "BINARY";
FIELD_TYPE_OBJECT = "OBJECT";
FIELD_TYPE_LIST = "LIST";
FIELD_TYPE_DATE = "DATE";

// Query object properties
QUERY_TYPE = "type";
QUERY_FIELD = "field";
// Query sort properties
QUERY_SORT = "sort";
QUERY_SORT_ASC = "asc";
QUERY_SORT_DESC = "desc";
// Query value properties
QUERY_VALUE = "value";
QUERY_VALUE_2 = "value2";
// Query types
QUERY_TYPE_BEGIN_GROUP = "beginGroup";
QUERY_TYPE_END_GROUP = "endGroup";
QUERY_TYPE_AND = "and";
QUERY_TYPE_OR = "or";
QUERY_TYPE_EQUAL_TO = "equalTo";
QUERY_TYPE_NOT_EQUAL_TO = "notEqualTo";
QUERY_TYPE_BEGINS_WITH = "beginsWith";
QUERY_TYPE_ENDS_WITH = "endsWith";
QUERY_TYPE_CONTAINS = "contains";
QUERY_TYPE_BETWEEN = "between";
QUERY_TYPE_GREATER_THAN = "greaterThan";
QUERY_TYPE_GREATER_THAN_OR_EQUAL_TO = "greaterThanOrEqualTo";
QUERY_TYPE_LESS_THAN = "lessThan";
QUERY_TYPE_LESS_THAN_OR_EQUAL_TO = "lessThanOrEqualTo";
QUERY_TYPE_LIKE = "like";
```

## Installation

This example app contains 3 important objects:
1. app.properties
2. icon.png
3. mobile.zip

#### app.properties
This files defines the app, with the following properties:
+ __displayName__: The display name of the app
+ __description__: A description of the app
+ __version__: The version of the app, e.g. 0.0.1 or 3.4.5 etc
+ __type__: This can be either app or desktop, or both (app,desktop)
+ __awgPlatformVersion__: The target appworks platform, this should be 16
+ __isAvailableOffline__: Allow this app to be used offline, can be true or false

#### icon.png
An icon that represents the app. This will appear in the gateway and on the device. 48x48px is ideal.

#### mobile.zip

This is your web content, such as html, js, css, images and any other assets.
The only essential file in your mobile.zip is index.html, which will be loaded by the appworks webview. Any other files or structure is up to the developer.

##### index.html

When your app is downloaded and installed in an appworks client, the client will place appworks.js, cordova.js and the cordova plugins in the root of your app.

In your html file, please include the following tags before any other javascript tags:

```html
<script type="text/javascript" src="cordova.js"></script>
<script type="text/javascript" src="appworks.js"></script>
```

#### Zipping and Deploying
1. Zip up the web content into a file named mobile.zip
2. Zip up the following files:
  + app.properties
  + icon.png
  + mobile.zip
3. Name this file in the format:
  + AppName_Version.zip
  + e.g. MyGreatApp_0.0.1.zip
  + __The version number in the filename must match the version number in app.properties__
4. Install the app on the gateway
  + Go to your gateway in a browser
  + sign in
  + go to app installation tab
  + drag and drop MyGreatApp_0.0.1.zip into the box.
  + Once fully deployed, enable the app.
