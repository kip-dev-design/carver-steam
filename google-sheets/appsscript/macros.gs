function SendtoPrint() {
  var row = SpreadsheetApp.getActiveSheet().getActiveCell().getRow();
  var values = SpreadsheetApp.getActive().getDataRange().getValues()[row-1];
  addToPrintList(values),onChangePrintList(values);
  //spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Print Layout'));
};



function Add_Selected_Student() {
  var row = SpreadsheetApp.getActiveSheet().getActiveCell().getRow();
  var spreadsheet = SpreadsheetApp.getActive();
  var id = spreadsheet.getRange("C" + row).getValue();
  onScan({value:id});
  //Logger.log(id)
};

function Get_Student_Grade() {
  var row = SpreadsheetApp.getActiveSheet().getActiveCell().getRow();
  var spreadsheet = SpreadsheetApp.getActive();
  var fname = spreadsheet.getRange("B" + row).getValue();
  var lname = spreadsheet.getRange("C" + row).getValue();
  var as = SpreadsheetApp.getActive().getSheetByName('All_Students').getDataRange().getValues().map(
    function(e,i){
      let fn = fname.toLowerCase().replace(/\'/g, "");
      let ln = lname.toLowerCase().replace(/\'/g, "");
      let f = e[3].toLowerCase().replace(/\'/g, "");
      let l = e[5].toLowerCase().replace(/\'/g, "");
      if (e[3] === fname && e[5] == lname || f == fn && l == ln) {
        spreadsheet.getRange("E"+row).setValue(e[0]);return e;
      }
    }
  );
  //Logger.log(id)
};


function UntitledMacro() {
    
};



function PropercaseTeacherNames() {
  var spreadsheet = SpreadsheetApp.getActive().getSheetByName('All_Staff');
  var count = spreadsheet.getDataRange().getValues().length;
  Logger.log(count);
  var r = SpreadsheetApp.getActive().getSheetByName('All_Staff').getDataRange().getValues().map(
    function(e,i){
      //let fn = fname.toLowerCase().replace(/\'/g, "");
      //let ln = lname.toLowerCase().replace(/\'/g, "");
      //let f = e[3].toLowerCase().replace(/\'/g, "");
      //let l = e[5].toLowerCase().replace(/\'/g, "");
      Logger.log(i);Logger.log(e[9]);
      if ((i+1)>0) {
        spreadsheet.getRange("I"+i).setValue(toUpperCase(e[8]));
        spreadsheet.getRange("J"+i).setValue(toUpperCase(e[9]));
        return e;
      }
    }
  );


};

function HighlightDups() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  let countMap = new Map();
  let dataMap = new Map();
 
  data.forEach((d, index) => {
    if (index === 0) return; // Skip header row
    let dateKey = new Date(d[0]).toLocaleDateString('en-US');

    const period = d[3];
    const sn = d[4];
    const key = `${dateKey}-${period}-${sn}`;

    if (countMap.has(key)) {
      countMap.set(key, countMap.get(key) + 1);
      dataMap.get(key).push({index:(index + 1),values:d});
      //gradeMap.get(grd).push(d);
    } else {
      countMap.set(key, 1);
      dataMap.set(key, [{index:(index + 1),values:d}]);
      //gradeMap.set(grd, [d]);
    }

  });
  let arr = [...dataMap.entries()].map(([key, data]) => {
    if (data.length > 1){
        data.forEach(row => {
          sheet.getRange(row.index, 1, 1, sheet.getLastColumn()).setBackground('#e88484');
        });
        return data
    }
      
  })

 return arr
};






