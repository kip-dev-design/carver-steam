var PRINT_OPTIONS = {
  'size': 7,               // paper size. 0=letter, 1=tabloid, 2=Legal, 3=statement, 4=executive, 5=folio, 6=A3, 7=A4, 8=A5, 9=B4, 10=B
  'fzr': false,            // repeat row headers
  'portrait': false,        // false=landscape
  'fitw': true,            // fit window or actual size
  'gridlines': false,      // show gridlines
  'printtitle': false,
  'sheetnames': false,
  'pagenum': 'UNDEFINED',  // CENTER = show page numbers / UNDEFINED = do not show
  'attachment': false
}

var PDF_OPTS = objectToQueryString(PRINT_OPTIONS);

//function onOpen(e) {SpreadsheetApp.getUi().createMenu('Print Late Arrivals').addItem('Print selected range', 'printSelectedRange').addToUi();}

function printSelectedRange() {
  SpreadsheetApp.flush();
  var sheetName = 'Print_List';
  var ss = getSheet(sheetName);
  var sheet = ss.sheet;
  if (!sheet) {return false;}
  var url = SpreadsheetApp.getActiveSpreadsheet().getUrl().replace(/edit$/, '') + 'export?format=pdf' + PDF_OPTS + printRange + "&gid=" + gid;
  var htmlTemplate = HtmlService.createTemplateFromFile('print-it');
  htmlTemplate.url = url;
  SpreadsheetApp.getUi().showModalDialog(htmlTemplate.evaluate().setHeight(10).setWidth(100), 'Print range');
}

function printSelectedRange2() {
  SpreadsheetApp.flush();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var currentDay = new Date();
  currentDay.setHours(7);

  let startrow = -1;
  sheet.getRange(1, 1, sheet.getLastRow(), 3).getValues().find(function(row, key) {
    var time = new Date(row[0]).getTime();
    var teacher = row[2];
    if (time >= currentDay.getTime() && teacher === 'n/a') {
      startrow = key + 1;
      return true;
    }
    // Check if time is today or greater and teacher is 'n/a'
  });
  console.log(startrow, sheet.getLastRow(),(sheet.getLastRow() - startrow + 1) );
  if (startrow === -1) {
    Logger.log("No eligible rows found.");
    return;
  }

  var range = sheet.getRange(startrow, 1, sheet.getLastRow() - startrow + 1, 9);
  console.log(range.getValues());
  var gid = sheet.getSheetId();

  // Find the min and max rows for the filtered data
  var minRow = startrow;
  var maxRow = sheet.getLastRow();

  var printRange = objectToQueryString({
    'c1': range.getColumn() - 1,
    'r1': minRow - 1,
    'c2': range.getColumn() + range.getWidth() - 1,
    'r2': maxRow - 1
  });
  console.log(printRange);
  var url = ss.getUrl().replace(/edit$/, '') + 'export?format=pdf' + PDF_OPTS + printRange + "&gid=" + gid;

  var htmlTemplate = HtmlService.createTemplateFromFile('js');
  htmlTemplate.url = url;
  SpreadsheetApp.getUi().showModalDialog(htmlTemplate.evaluate().setHeight(10).setWidth(100), 'Print range');
}

function objectToQueryString(obj) {
  return Object.keys(obj).map(function(key) {
    return Utilities.formatString('&%s=%s', key, obj[key]);
  }).join('');
}
