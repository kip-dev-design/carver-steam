const spreadsheetId = PropertiesService.getScriptProperties().getProperty('sheetID');
function getsheetID(){return spreadsheetId;}
function test(){console.log(getallstudents())}

function generateID(n=14) {
    var a, e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    //do {
        a = "";
        for (var o = 0; o < n; o++) {
            var t = Math.floor(Math.random() * e.length);
            a += e.charAt(t)
        }
    //} while (isID(a));
    return a
}

function getlatestpasslist(){
  //var spreadsheetId = "1sSJhkbc_a9C4jY7wO1uVU1c7nR9qGW7HsK_-y0ftOzE";
  let monthyear = new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');
  var sheetName = monthyear+" Responses";
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  let c = getperiod();
  
  if (!sheet) {throw new Error(`Sheet with name '${sheetName}' not found.`);}

  // Get the data range in the sheet
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var headers = values[0].map(function (header) {return header.toString().toLowerCase(); });
  var rows = [];
  values = values.slice(1);
  let lastitem = values[values.length - 1];
  //console.log(values);
  var start = new Date();
  var end = new Date();
  start.setHours(c.start.split(":")[0], c.start.split(":")[1], 0, 0); // Set time to the beginning
  end.setHours(c.end.split(":")[0], c.end.split(":")[1], 0, 0); // Set time to the end
 
  // Loop through rows (excluding the header row)
  for (var row = 0; row < values.length; row++) {
    var timestamp = new Date(values[row][0]);
    if (timestamp.getTime() >= start.getTime() && timestamp.getTime() <= end.getTime()) {
      var rowData = {};
      for (var col = 0; col < headers.length; col++) {
        rowData[headers[col]] = values[row][col];
      }
      rows.push(rowData);
    }
  }

  // Convert JSON object to string
  var jsonString = JSON.stringify(rows);
  //console.log(jsonString, rows);
  // Return the JSON string
  return rows;
}

function getactivepasses(){
  //var spreadsheetId = "1sSJhkbc_a9C4jY7wO1uVU1c7nR9qGW7HsK_-y0ftOzE";
  let monthyear = new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');
  var sheetName = monthyear+" Responses";
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  var currentDay = new Date();
  currentDay.setHours(0, 0, 0, 0); // Set time to the beginning of the day

  if (!sheet) {
    throw new Error(`Sheet with name '${sheetName}' not found.`);
  }

  // Get the data range in the sheet
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var headers = values[0].map(function (header) {
    return header.toString().toLowerCase();
  });
  var rows = [];
  values = values.slice(1);
  Logger.log(values);
  // Loop through rows (excluding the header row)
  for (var row = 1; row < values.length; row++) {
    var timestamp = new Date(values[row][0]);
    if (timestamp.getTime() >= currentDay.getTime()) {
      var rowData = {};
      for (var col = 0; col < headers.length; col++) {
        rowData[headers[col]] = values[row][col];
      }
      rows.push(rowData);
    }
  }

  // Convert JSON object to string
  var jsonString = JSON.stringify(rows);
  Logger.log(jsonString);
  // Return the JSON string
  return rows;
}

function getPassbyID(id){
  let monthyear = new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');
  var sheetName = monthyear + " Responses";
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(`Sheet with name '${sheetName}' not found.`);
  }
  
  // Get the data range in the sheet
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var headers = values[0].map(function (header) {
    return header.toString().toLowerCase();
  });
  
  // Find the row that matches the given ID
  var match = values.find(function (row) {
    return row[1] == id;
  });
  console.log(match);
  // Initialize an empty object to store the information
  var info = {};

  // If a match is found, populate the info object with headers and values
  if (match) {
    match.forEach(function (v, k) {
      info[headers[k]] = v;
    });
  } else {
    throw new Error(`No matching record found for ID '${id}'.`);
  }

  // Return the JSON object
  console.log(info);
  return info;
}

function generatePassID() {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var codeLength = 12;
  var code;
  
  do {
    code = '';
    for (var i = 0; i < codeLength; i++) {
      var randomIndex = Math.floor(Math.random() * chars.length);
      code += chars.charAt(randomIndex);
    }
  } while (isCodeDuplicate(code));
  //Logger.log(code);
  // At this point, 'code' contains a unique random code
  return code;
}

function isCodeDuplicate(code) {
  //var spreadsheetId = "1sSJhkbc_a9C4jY7wO1uVU1c7nR9qGW7HsK_-y0ftOzE";
  let monthyear = new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');
  var sheetName = monthyear+" Responses";
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  // Get the data range in the sheet
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  values = values.slice(1).map(e=>{return e[1]});
  var targetArray = values; // Replace this with your actual array of codes

  return targetArray.indexOf(code) !== -1;
}

function isPassDuplicate(studentData,minutes=15) {
  let monthyear = new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');
  var sheetName = monthyear+" Responses";
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  let currentTime = new Date();
  
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  values = values.slice(1).map(e=>{return e});
  values = values.filter(e=> new Date(e[0])> currentTime.getTime() - minutes * 60 * 1000);
  var targetArray = values.filter(e=> studentData.first==e[6]&&studentData.last==e[7]); // Replace this with your actual array of codes
  Logger.log(targetArray);
  // Iterate through the dataset and find the last occurrence of the student
  return targetArray.length>0?!0:!1;
}

function updateclassreturn(e) {
  //var spreadsheetId = "1sSJhkbc_a9C4jY7wO1uVU1c7nR9qGW7HsK_-y0ftOzE";
  let monthyear = new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');
  var sheetName = monthyear+" Responses";
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);

  var data = sheet.getDataRange().getValues();

  for (var i = 0; i < data.length; i++) {
    if (data[i][1] === e.pass_id) {
      sheet.getRange(i + 1, 10).setValue(now()); // Column J is index 10 (A-based)
      return {"pass_id":e.pass_id,"returned":now()}; // Exit loop after updating the first matching row
    }
  }
}

function timeAgo(timestamp) {
  // Parse the input timestamp string
  var date = new Date(timestamp);
  
  // Calculate the time difference in milliseconds
  var now = new Date();
  var timeDiff = now - date;
  
  // Define time units in milliseconds
  var minute = 60 * 1000;
  var hour = 60 * minute;
  var day = 24 * hour;
  var week = 7 * day;
  var month = 30 * day;
  
  // Determine the appropriate time unit
  var timeUnit, timeValue;
  
  if (timeDiff < minute) {
    timeUnit = "second";
    timeValue = Math.floor(timeDiff / 1000);
  } else if (timeDiff < hour) {
    timeUnit = "minute";
    timeValue = Math.floor(timeDiff / minute);
  } else if (timeDiff < day) {
    timeUnit = "hour";
    timeValue = Math.floor(timeDiff / hour);
  } else if (timeDiff < week) {
    timeUnit = "day";
    timeValue = Math.floor(timeDiff / day);
  } else if (timeDiff < month) {
    timeUnit = "week";
    timeValue = Math.floor(timeDiff / week);
  } else {
    timeUnit = "month";
    timeValue = Math.floor(timeDiff / month);
  }
  
  // Format the result based on singular or plural
  if (timeValue !== 1) {
    timeUnit += "s";
  }
  
  return timeValue + " " + timeUnit + " ago";
}

function getPrintList() {
  var spreadsheetId = "1sSJhkbc_a9C4jY7wO1uVU1c7nR9qGW7HsK_-y0ftOzE";
  let monthyear = new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');
  var sheetName = 'Print_List';
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(`Sheet with name '${sheetName}' not found.`);
  }
  
  // Get the data range in the sheet
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var headers = values[0].map(function (header) {
    return header.toString().toLowerCase();
  });
  //console.log(values);
  
  return (values.length ==1 && values[0]=='')?[]:values;
}

function addToPrintList2(data) {
  var sheetName = 'Print_List';
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {sheet = spreadsheet.insertSheet(sheetName);}
  let info = getPassbyID(data.pass_id)
  sheet.appendRow(Object.values(info));
  
  Logger.log(`${Object.values(info)[1]} Entry added successfully.`);
  return true;
}

function addToPrintList(e){
  var t="Print_List",
  n=SpreadsheetApp.openById(spreadsheetId),
  i=n.getSheetByName(t);
  i||(i=n.insertSheet(t));
  let a=getPassbyID(e.pass_id);
  console.log(288, a);
  return i.appendRow(Object.values(a)),!0
}

function deleteFirstRowPrintList() {
  var sheetName = 'Print_List';
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);

  var lastRow = sheet.getLastRow();
  if (lastRow === 1) {
    sheet.getRange(1, 1, 1, sheet.getLastColumn()).clearContent();
    Logger.log("First row cleared as it was the only row in the sheet.");
    return true;
  } else if (lastRow > 1) {
    sheet.deleteRow(1);
    Logger.log("First row deleted.");return true;
  } else {
    Logger.log("Sheet is empty, nothing to clear or delete.");return false;
  }
}

function deleteAllRowsInSheet2() {
  var sheetName = 'Print_List';
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);

  // Get the range of all data in the sheet
  var range = sheet.getDataRange();

  // Clear all content in the range (delete all rows)
  range.clearContent();
  return true;
  Logger.log("All rows deleted in the sheet.");
}

function deleteAllRowsInSheet(){return SpreadsheetApp.openById(spreadsheetId).getSheetByName('Print_List').getDataRange().clearContent(),!0}
