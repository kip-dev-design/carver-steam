function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Carver Task')
      .addSeparator()
      .addSubMenu(SpreadsheetApp.getUi().createMenu("Late Reports")
        .addItem('Show Weekly Reports', 'showWeeklyReports')
        .addItem('Print Weekly Reports', 'printWeeklyReports')
        .addItem('Weekly Detention Letters', 'makeDetentionNotice')
        .addSeparator()
        .addItem('Show All Reports', 'showReports')
        .addItem('Print All Reports', 'printReports')
        .addSeparator()
        .addItem('Show 9th Grade Reports', 'showReports9')
        .addItem('Print 9th Grade Reports', 'printReports9')
        .addSeparator()
        .addItem('Show 10th Grade Reports', 'showReports10')
        .addItem('Print 10th Grade Reports', 'printReports10')
        .addSeparator()
        .addItem('Show 11th Grade Reports', 'showReports11')
        .addItem('Print 11th Grade Reports', 'printReports11')
        .addSeparator()
        .addItem('Show 12th Grade Reports', 'showReports12')
        .addItem('Print 12th Grade Reports', 'printReports12')
      )
      .addSeparator()
      //.addItem('Print Report', 'printReports')
      //.addSubMenu(ui.createMenu('Sub-menu')
          //.addItem('Second item', 'menuItem2'))
  .addToUi();

  var menu = [{name: "Send Email", functionName: "sendToAttendance"}];SpreadsheetApp.getActiveSpreadsheet().addMenu("Send Email", menu);
  SpreadsheetApp.getUi().createMenu('Print Late Arrivals').addItem('Print selected range', 'printPass').addToUi();
  //checkAndUpdateSheet();
}

function onScan(e) {
  var sid = e.value;
  var as = SpreadsheetApp.getActive().getSheetByName('All_Students');
  var asv = as.getDataRange().getValues();
  var r = asv.filter(function(row,i){
    if (row[2] === sid) {
      Logger.log('Row Data : ' + row);
      Logger.log('Current Cell: ' + i + ' ');
      let period = getperiod().period||"";
      post_response({teacher:'n/a',period:period,studentnumber:row[2],grade:row[0],first:row[3],last:row[5],reason:'Auto Generated',});
      return row;
    }
  });
  Logger.log(r);
}

function post_response(data){
  Logger.log(data);
      if (isPassDuplicate(data)){return ({"post_response":"Duplicate"});}
      if (!data.studentnumber){data=getstudentDetails(data);if(data.firstname){data.first=data.firstname;data.last=data.lastname}}
      let passid = generatePassID();data.pass_id=passid;
      create_post([data.pass_id,data.teacher,data.period,data.studentnumber,data.grade,data.first,data.last,data.reason]);
      //var response = UrlFetchApp.fetch("https://docs.google.com/forms/d/e/1FAIpQLSeUAHPhiJHHe5w3gcFsjG_glhF2AEuUa8kwONo-ZcQVP_pU0w/formResponse?usp=pp_url&entry.1986886394="+data.teacher+"&entry.1638200610="+data.period+"&entry.1237249395="+data.studentnumber+"&entry.1186110438="+data.grade+"&entry.654126513="+encodeURIComponent(data.first)+"&entry.1387067905="+encodeURIComponent(data.last)+"&entry.2096164328="+(data.reason)+"&entry.1214007768="+passid+"&submit=Submit");
      return {"post_response":"success","pass_id":passid};
}

function create_post(data){
  let form = FormApp.openById('1Ik6VET_Up8BxVvOvZJBgvLORRt_1--ev2ifD8oyBr_Q');
  const formResponse = form.createResponse();
    // Assuming your form items follow a specific order like: Text, Text, Text, Text, Text, Text, Text, Text, Text
  var textItemResponses = data.map(function(itemValue) {return itemValue.toString();});
  // Handle text items
  var textItems = form.getItems(FormApp.ItemType.TEXT);
  textItems.forEach(function(item, index) {data[index]&&formResponse.withItemResponse(item.asTextItem().createResponse(textItemResponses[index]));});
  // Submits the form response.
  formResponse.submit();
  return true;
}

function onFormSubmit(e) {
  var as = SpreadsheetApp.getActive().getSheetByName('All_Students');
  var asv = as.getDataRange().getValues();SpreadsheetApp.flush();
  var sheet = e.range.getSheet();
  // This function will be called everytime the form is submitted.
  //onFormSubmitEmail(e);
  
  console.log("52",e.values);
  //form.setConfirmationMessage('Pass To Class for '+ fname + ' ' + lname + '! Please allow student to enter class using this as a valid pass! ');

}

function testScan() {console.log(getReports({weekly:true}).output);}


function getReports(a = {grade: null,weekly: false}) {
    var arr = [];
    let monthyear = new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');
    var sheetName = monthyear + " Responses";
    var ss = SpreadsheetApp.getActive();
    var sheet = ss.getSheetByName(sheetName);
    var values = sheet.getDataRange().getValues();
    var vv = values;
    var hh = values[0];
    if (a.weekly) {
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        // Calculate the previous week's Thursday
        const daysToSubtract = currentDay >= 4 ? currentDay - 4 + 7 : currentDay + 3;
        const weekStartDate = new Date(currentDate.setDate(currentDate.getDate() - daysToSubtract));
        weekStartDate.setHours(10, 0, 0, 0);
        const currentWeekEndDate = new Date(
            weekStartDate.getTime() + (6 * 24 * 60 * 60 * 1000) // 6 days after the previous Thursday
        );
        values = values.filter((d) => {
            const dateObj = new Date(d[0]);
            // Check if the date is within the desired range and after 10:00 AM
            return dateObj >= weekStartDate && dateObj <= currentWeekEndDate && dateObj.getHours() >= 10;
        });
    }

    var outputArr = values.map(function (d, i) {
        let sn = d[4] || null;
        if (d[2] != 'n/a' && d[2].length > 3) {return;}
        let find = arr.findIndex(e => e.studentnumber == sn);
        if (find > -1) { 
            arr[find].count += 1;
            arr[find].dates.push(d[0].toString().replaceAll('GMT-0400 (Eastern Daylight Time)', '<br />').replaceAll('GMT-0500 (Eastern Standard Time)', '<br />'));
        } else {
            let sd = {
                count: 1,
                grade: d[5],
                dates: [d[0].toString().replaceAll('GMT-0400 (Eastern Daylight Time)', '<br />').replaceAll('GMT-0500 (Eastern Standard Time)', '<br />')]
            };
            if (sn) {
                sd = Object.assign(sd, SI.getStudentDetails({studentnumber: sn}).student)
            }
            arr.push(sd);
        }
    });
    Logger.log(a.grade);Logger.log(arr.length);
    if (a.grade) {arr = arr.filter(e => e.grade == a.grade);}
    arr = arr.filter(e => e.count > 3);
    arr = arr.sort((a, b) => b.count - a.count); // b - a for reverse sort;
    let h = `<table class="table table-sm"><thead><tr><th scope="col">#</th><th scope="col">Grade</th><th scope="col">Count</th><th scope="col">Name</th><th scope="col">SN #</th></tr></thead><tbody>`;
    arr.forEach(function (e, key) {
        h += `<tr><th scope="row">${key+1}</th><td>${e.grade}</td><td>${e.count}</td><td>${e.firstname +' '+ e.lastname}</td><td>${e.studentnumber}</td></tr>`;
    })
    h += `</tbody></table>`;
    return {array: arr,output: h};
}

function getReportData(a={}){
    if(!("values"in a))return;
    var arr = [];
    var values = a.values;

    values.map(function (d, i) {
        let sn = d[4] || null;
        if (d[2] != 'n/a' && d[2].length > 3) {return;}
        let find = arr.findIndex(e => e.studentnumber == sn);
        if (find > -1) { 
            arr[find].count += 1;
            arr[find].dates.push(d[0].toString().replaceAll('GMT-0400 (Eastern Daylight Time)', '<br />').replaceAll('GMT-0500 (Eastern Standard Time)', '<br />'));
        } else {
            let sd = {
                count: 1,
                grade: d[5],
                dates: [d[0].toString().replaceAll('GMT-0400 (Eastern Daylight Time)', '<br />').replaceAll('GMT-0500 (Eastern Standard Time)', '<br />')]
            };
            if (sn) {
                sd = Object.assign(sd, SI.getStudentDetails({studentnumber: sn}).student)
            }
            arr.push(sd);
        }
    });
    if(("count"in a)&& a.count > 0){arr = arr.filter(e => e.count > a.count)}
    arr = arr.sort((a, b) => b.count - a.count);
    let h = `<table class="table table-sm defaultTable"><thead><tr><th scope="col">#</th><th scope="col">Grade</th><th scope="col">Count</th><th scope="col">Name</th><th scope="col">SN #</th></tr></thead><tbody>`;
    arr.forEach(function (e, key) {
        h += `<tr><th scope="row">${key+1}</th><td>${e.grade}</td><td>${e.count}</td><td>${e.firstname +' '+ e.lastname}</td><td>${e.studentnumber}</td></tr>`;
    })
    h += `</tbody></table>`;
    return {array: arr,output: h};
}

function showWeeklyReports(){
    let content = getReports({weekly:true}).output;Logger.log(content);
    var template = HtmlService.createHtmlOutput(`<!DOCTYPE html><html><head><base target="_top"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css"><style>.display-6 {font-size: 1.75rem;font-weight: 350;line-height: 2.2;}</style></head><body><div class="container"><div class="container-fluid d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center "><h6 class="display-6">Detention List</h6><p class="display-6">${new Date().toLocaleDateString('en-US')}</p></div>${content}</div></body></html>`);
    var h = template.setWidth(1200).setHeight(650);
    var ui = SpreadsheetApp.getUi().showModalDialog(h, 'Late Report');
}
function printWeeklyReports(){
    let content = getReports({weekly:true}).output;Logger.log(content);
    var template = HtmlService.createHtmlOutput(`<!DOCTYPE html><html><head><base target="_top"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css"><style>.display-6 {font-size: 1.75rem;font-weight: 350;line-height: 2.2;}</style></head><script>window.addEventListener("DOMContentLoaded",function(){window.print();google.script.host.close();});</script><body><div class="container mt-2 mb-4 p-2"><div class="container-fluid d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center "><h6 class="display-6">Detention List</h6><p class="display-6">${new Date().toLocaleDateString('en-US')}</p></div>${content}</div></body></html>`);
    var h = template.setWidth(1200).setHeight(450);
    var ui = SpreadsheetApp.getUi().showModalDialog(h, 'Print Weekly Report');
}
function showReports(){
    let content = getReports().output;Logger.log(content);
    var template = HtmlService.createHtmlOutput(`<!DOCTYPE html><html><head><base target="_top"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css"></head><body><div class="container">${content}</div></body></html>`);
    var h = template.setWidth(1200).setHeight(650);
    var ui = SpreadsheetApp.getUi().showModalDialog(h, 'Late Report');
}
function printReports(){
    let content = getReports().output;
    var template = HtmlService.createHtmlOutput(`<!DOCTYPE html><html><head><base target="_top"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css"></head><script>window.addEventListener("DOMContentLoaded",function(){window.print();google.script.host.close();});</script><body><div class="container mt-2 mb-4 p-2">${content}</div></body></html>`);
    var h = template.setWidth(1200).setHeight(450);
    var ui = SpreadsheetApp.getUi().showModalDialog(h, 'Print Late Report');
}

function showReports9(){
  let grade=9;
    let content = getReports(grade).output;
    var template = HtmlService.createHtmlOutput(`<html><head><base target="_top"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css"></head><body><div class="container">${content}</div></body></html>`);
    var h = template.setWidth(1200).setHeight(650);
    var ui = SpreadsheetApp.getUi().showModalDialog(h, `Late Report ${grade}th Grade`);
}
function printReports9(){
    let grade=9;
    let html = getXmlContent({stdentname:"Test"});
    let content = getReports(grade).output;
    var template = HtmlService.createHtmlOutput(`<html><head><base target="_top"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css"><script src="https://cdn.jsdelivr.net/gh/Johnsonapsk12/dymo.label.framework/js.js" crossorigin="anonymous"></script></head>
    <script>
    var label;
    var global = {lastFetchedData: null,monthyear:'',xml:'',macrourl:''};

    async function getAddressLabelXml(obj) {
            var labelXml = await new XMLSerializer().serializeToString(global.xml);
              //console.log(19, obj);
              labelXml = labelXml.replace("{{pass}}", "Pass To Class");
              labelXml = labelXml.replace("{{url}}", obj.studentnumber);
              labelXml = labelXml.replace("{{studentname}}", obj.studentname);
              labelXml = labelXml.replace("{{period}}", obj.period);
              labelXml = labelXml.replace("{{datetime}}", obj.datetime);
              //updatePreview();
              return new Promise((resolve, _) => {resolve(labelXml)});
          }
          
          async function onload() {
          	loadPrinters().then(async (printer) => {
            	console.log(printer.name +" Printer Loaded");updatePreview(label); fetchdata();
          	});
          }
          
          async function loadLabelFromWeb() {
              return new Promise(async (resolve, _) => {
              		resolve(dymo.label.framework.openLabelXml(await getAddressLabelXml({
                      studentname: "Student Name",
                      datetime: now(),
                      period: getperiod().text
                  })))
              });
          }
          
          function updatePreview(lbl) {
              if (!lbl) return lbl;
              try{
              		var pngData = lbl.render();
                  global.preview = "data:image/png;base64," + pngData;
              }catch(e){console.log(52,e.toString().split('at')[0].split(': ')[1]);}
              finally{return lbl;}
           }
          
         async function loadPrinters() {
              var printers = dymo.label.framework.getPrinters();
              let result;
              if (printers.length == 0) {
                  result = ("No DYMO printers are installed. Install DYMO printers.");
                  //return;
              }
              for (var i = 0; i < printers.length; i++) {
                var printer = printers[i];
                if (printer.printerType == "LabelWriterPrinter") {
                    var printerName = printer.name;
                    global.printer = printerName;
                    if(printer.isConnected==true){
                    	result = printer;
                      $("#alertbox").html("Printer Online! " + printerName);
                      $("#alertbox").show();
                      break;
                    }else{
                      $("#alertbox").html("No Printer! " + printerName);
                      $("#alertbox").removeClass('alert-info');
                      $("#alertbox").addClass('alert-danger');
                      $("#alertbox").show();
                    }
                    
                
                    
                }
                
                
            }
          	return new Promise((resolve, _) => {resolve(result)});

          }
          
          function initTests() {if (dymo.label.framework.init) {dymo.label.framework.init(onload);} else {onload();}}
    if (window.addEventListener) window.addEventListener("load", initTests, false);
          else if (window.attachEvent) window.attachEvent("onload", initTests);
          else window.onload = initTests;

    //window.addEventListener("DOMContentLoaded",function(){window.print();google.script.host.close();});
    $(function() {
        $(document).ready(function(){
            $.ajax({
                type: "get",
                url: "https://cdn.jsdelivr.net/gh/38406/carver/dymolayout-30336.xml",
                success: function(data) {
                  global.xml = data;console.log(104, "Loaded XML");
                  loadLabelFromWeb().then(async (lbl)=> {
                    global.label = lbl;label=lbl;
                  });
                  
                },
                error: function(xhr, status) {console.log(status);}
            });
            
        });
    });
    </script><body><div class="container">${html}</div></body></html>`);
    var h = template.setWidth(1200).setHeight(450);
    var ui = SpreadsheetApp.getUi().showModalDialog(h, `Print Late Report ${grade}th Grade`);
}
function showReports10(){
  let grade=10;
    let content = getReports(grade).output;
    var template = HtmlService.createHtmlOutput(`<html><head><base target="_top"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css"></head><body><div class="container">${content}</div></body></html>`);
    var h = template.setWidth(1200).setHeight(650);
    var ui = SpreadsheetApp.getUi().showModalDialog(h, `Late Report ${grade}th Grade`);
}
function printReports10(){
  let grade=10;
    let content = getReports(grade).output;
    var template = HtmlService.createHtmlOutput(`<html><head><base target="_top"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css"></head><script>window.addEventListener("DOMContentLoaded",function(){window.print();google.script.host.close();});</script><body><div class="container">${content}</div></body></html>`);
    var h = template.setWidth(1200).setHeight(450);
    var ui = SpreadsheetApp.getUi().showModalDialog(h, `Print Late Report ${grade}th Grade`);
}

function showReports11(){
  let grade=11;
    let content = getReports(grade).output;
    var template = HtmlService.createHtmlOutput(`<html><head><base target="_top"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css"></head><body><div class="container">${content}</div></body></html>`);
    var h = template.setWidth(1200).setHeight(650);
    var ui = SpreadsheetApp.getUi().showModalDialog(h, `Late Report ${grade}th Grade`);
}
function printReports11(){
  let grade=11;
    let content = getReports(grade).output;
    var template = HtmlService.createHtmlOutput(`<html><head><base target="_top"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css"></head><script>window.addEventListener("DOMContentLoaded",function(){window.print();google.script.host.close();});</script><body><div class="container">${content}</div></body></html>`);
    var h = template.setWidth(1200).setHeight(450);
    var ui = SpreadsheetApp.getUi().showModalDialog(h, `Print Late Report ${grade}th Grade`);
}

function showReports12(){
  let grade=12;
    let content = getReports(grade).output;
    var template = HtmlService.createHtmlOutput(`<html><head><base target="_top"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css"></head><body><div class="container">${content}</div></body></html>`);
    var h = template.setWidth(1200).setHeight(650);
    var ui = SpreadsheetApp.getUi().showModalDialog(h, `Late Report ${grade}th Grade`);
}
function printReports12(){
  let grade=12;
    let content = getReports(grade).output;
    var template = HtmlService.createHtmlOutput(`<html><head><base target="_top"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css"></head><script>window.addEventListener("DOMContentLoaded",function(){window.print();google.script.host.close();});</script><body><div class="container">${content}</div></body></html>`);
    var h = template.setWidth(1200).setHeight(450);
    var ui = SpreadsheetApp.getUi().showModalDialog(h, `Print Late Report ${grade}th Grade`);
}

function toProperCase(s) {s = s.toString().toLowerCase().replace(/^(.)|\s(.)/g, function($1) { return $1.toUpperCase(); });return s}

function toUpperCase(s) {return s.toString().toUpperCase();}



