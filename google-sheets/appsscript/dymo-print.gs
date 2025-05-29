const printlist = () => getSheet('Print_List');
function printPass(data) {
  SpreadsheetApp.flush();
  var sheetName = 'Print_List';
  var ss = getSheet(sheetName);
  var sheet = ss.sheet;
  if (!sheet || !ss.values[0][0]) {return false;}
  console.log(ss.values[0]);
  var range = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
  console.log(range.getValues());
  var gid = sheet.getSheetId();

  // Find the min and max rows for the filtered data
  var minRow = 1;
  var maxRow = sheet.getLastRow();

  var printRange = objectToQueryString({
    'c1': range.getColumn() - 1,
    'r1': minRow - 1,
    'c2': range.getColumn() + range.getWidth() - 1,
    'r2': maxRow - 1
  });
    var url = SpreadsheetApp.getActiveSpreadsheet().getUrl().replace(/edit$/, '') + 'export?format=pdf' + PDF_OPTS + printRange + "&gid=" + gid;
    
  var htmlTemplate = HtmlService.createTemplateFromFile('print-it');
  htmlTemplate.url = url;
  htmlTemplate.data = data; 
  SpreadsheetApp.getUi().showModalDialog(htmlTemplate.evaluate().setHeight(450).setWidth(1200), 'Print Passes');
}
function urlFetch(url){
  return UrlFetchApp.fetch(url).getContentText();
}
function getData() {
  // Example based on the question code
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Print_List');
  var data = sheet.getRange().getValues();
  return data;
}

function getXmlContent(obj) {
    var labelXml = UrlFetchApp.fetch('https://cdn.jsdelivr.net/gh/38406/carver/dymolayout-30336.xml').getContentText();
      //console.log(19, obj);
      labelXml = labelXml.replace("{{pass}}", "Pass To Class");
      labelXml = labelXml.replace("{{url}}", obj.studentnumber);
      labelXml = labelXml.replace("{{studentname}}", obj.studentname);
      labelXml = labelXml.replace("{{period}}", obj.period);
      labelXml = labelXml.replace("{{datetime}}", obj.datetime);
      //updatePreview();
      return (labelXml);
}
function onChangePrintList(e) {
  var sheetName = "Print_List";
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  console.log(51, e);
  if (sheet.getLastRow() > 0) {
    var values = sheet.getDataRange().getValues();
    console.log(58, values);
    values.map((d)=> {return {timestamp:d[0],pass_id:d[1],teacher:d[2],period:d[3],studentnumber:d[4],grade:d[5],firstname:d[6],lastname:d[7],reason:d[8]} })
    //.forEach((row)=>{
        //setTimeout(function(){
            //printPass(row);
        //}, 1000);
    //});
    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      var valueToLog = row; // Assuming you want to log the third column (index 2)
      Logger.log(valueToLog);
      //printPass(row);
      // Remove the row from the sheet
      //sheet.deleteRow(i + 1);
      var lastRow = sheet.getLastRow();
      if (lastRow === 1) {
        //sheet.getRange(1, 1, 1, sheet.getLastColumn()).clearContent();
        Logger.log("First row cleared as it was the only row in the sheet.");
        return true;
      } else if (lastRow > 1) {
        //sheet.deleteRow(i + 1);
        Logger.log("First row deleted.");return true;
      } else {
        Logger.log("Sheet is empty, nothing to clear or delete.");return false;
      }
    }
  }
  
}

function createSpreadsheetChangeTrigger() {
 
  var sheetName = "Print_List";
  var sheet = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('onChangePrintList')
   .forSpreadsheet(sheet)
   .onChange()
   .create();
}



