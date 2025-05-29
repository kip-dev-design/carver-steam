//function onOpen() {var menu = [{name: "Send Email", functionName: "sendToAttendance"}];SpreadsheetApp.getActiveSpreadsheet().addMenu("Send Email", menu);}

// To learn how to use this script, refer to the documentation:
// https://developers.google.com/apps-script/samples/automations/content-signup

/*
Copyright 2022 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// To use your own template doc, update the below variable with the URL of your own Google Doc template.
// Make sure you update the sharing settings so that 'anyone'  or 'anyone in your organization' can view.
const EMAIL_TEMPLATE_DOC_URL = 'https://docs.google.com/document/d/10YVJnAPVKIhNh90iE8fl43_oSPK3q5wVAxU9hN3aX78/edit?usp=sharing';
// Update this variable to customize the email subject.
const EMAIL_SUBJECT = 'Hello, here is the content you requested';

const EMAIL_RECEPIENT = 'EMAIL GROUP SEPERATED BY COMMA';
const EMAIL_RECEPIENT2 = 'EMAIL GROUP SEPERATED BY COMMA';
const EMAIL_RECEPIENT3 = 'EMAIL GROUP SEPERATED BY COMMA';

// Update this variable to the content titles and URLs you want to offer. Make sure you update the form so that the content titles listed here match the content titles you list in the form.
const topicUrls = {
  'Google Calendar how-to videos': 'https://www.youtube.com/playlist?list=PLU8ezI8GYqs7IPb_UdmUNKyUCqjzGO9PJ',
  'Google Drive how-to videos': 'https://www.youtube.com/playlist?list=PLU8ezI8GYqs7Y5d1cgZm2Obq7leVtLkT4',
  'Google Docs how-to videos': 'https://www.youtube.com/playlist?list=PLU8ezI8GYqs4JKwZ-fpBP-zSoWPL8Sit7',
  'Google Sheets how-to videos': 'https://www.youtube.com/playlist?list=PLU8ezI8GYqs61ciKpXf_KkV7ZRbRHVG38',
};

/**
 * Installs a trigger on the spreadsheet for when someone submits a form.
 */
function installTrigger() {
  ScriptApp.newTrigger('onFormSubmit')
      .forSpreadsheet(SpreadsheetApp.getActive())
      .onFormSubmit()
      .create();
}

/**
 * Sends a customized email for every form response.
 * 
 * @param {Object} event - Form submit event
 */
function onFormSubmitEmail(e) {
  Logger.log(JSON.stringify(e));
  let responses = '';//e.namedValues;

  //if (isTimeInRange("9:45", "10:05")){
  //  sendToAttendance(e);
  //}
  var spreadsheetId = "1sSJhkbc_a9C4jY7wO1uVU1c7nR9qGW7HsK_-y0ftOzE";
  let monthyear = new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');
  var sheetName = monthyear+" Responses";
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);

  // Append the status on the spreadsheet to the responses' row.
  let status = 'SpreadsheetApp.getActiveSheet()';
  //let row = sheet.getActiveRange().getRow();
  //let column = e.values.length + 1;
  //sheet.getRange(row, column).setValue(status);

  Logger.log("status=" + status + "; responses=" + JSON.stringify(responses));
}

function test(){console.log(getReportData({values:getWeeklyReportM(),count:1}).output);}
/**
 * Creates email body and includes the links based on topic.
 *
 * @param {string} recipient - The recipient's email address.
 * @param {string[]} topics - List of topics to include in the email body.
 * @return {string} - The email body as an HTML string.
 */
function createEmailBody(e) {
  
  if (!e.topicsHtml){return false;}
  //topicsHtml = '<ul>' + topicsHtml + '</ul>';
  
  // Make sure to update the emailTemplateDocId at the top.
  let docId = DocumentApp.openByUrl(EMAIL_TEMPLATE_DOC_URL).getId();
  //Logger.log(docId);
  let emailBody = docToHtml(docId);
  emailBody = emailBody.replace(/<\/style>/,'table.defaultTable{width:100%;text-align:center}table.defaultTable td,table.defaultTable th{border:1px solid #aaa;padding:5px 2px}table.defaultTable thead{background:#ddd}table.defaultTable thead th{font-size:15px;font-weight:700;text-align:center}\n</style>');
  console.log(emailBody);
  emailBody = emailBody.replace(/{{BODY}}/g, e.body);
  emailBody = emailBody.replace(/{{NAME}}/g, e.name);
  emailBody = emailBody.replace(/{{TOPICS}}/g, e.topicsHtml);
  return emailBody;
}

/**
 * Downloads a Google Doc as an HTML string.
 * 
 * @param {string} docId - The ID of a Google Doc to fetch content from.
 * @return {string} The Google Doc rendered as an HTML string.
 */
function docToHtml(docId) {
  // Downloads a Google Doc as an HTML string.
  let url = "https://docs.google.com/feeds/download/documents/export/Export?id=" + docId + "&exportFormat=html";
  let param = {
    method: "get",
    headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(url, param).getContentText();
}

function getEmailContent() {
  var spreadsheetId = "1sSJhkbc_a9C4jY7wO1uVU1c7nR9qGW7HsK_-y0ftOzE";
  let monthyear = new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');
  var sheetName = monthyear+" Responses";
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  var currentDay = new Date();currentDay.setHours(7);
  
  let {startRow, endRow }= findStartAndEndRows(sheet, new Date());
  console.log(startRow, endRow);
  if (startRow==-1){return false;}
  var data = sheet.getRange(startRow, 1, endRow - startRow, sheet.getLastColumn()).getValues();
  
  var emailContent;
  emailContent = `<table class="defaultTable"><thead><tr><th scope="col">#</th><th scope="col">Time</th><th scope="col">Grade</th><th scope="col">First</th><th scope="col">Last</th><th scope="col">SN #</th></tr></thead><tbody>`;//"<ul>";
  
  data.forEach(function(row,key) {
    var timestamp = row[0].toLocaleString().replaceAll('GMT-0400 (Eastern Daylight Time)','');
    var firstname = row[6];
    var lastname = row[7];
    var grade = row[5];
    var studentnumber = row[4];
    
    
    emailContent += `<tr><th scope="row">${key+1}</th><td>${timestamp}</td><td>${grade}</td><td>${firstname}</td><td>${lastname}</td><td>${studentnumber}</td></tr>`;
    
  });
  
  emailContent += `</tbody></table>`;//"</ul>";
  Logger.log(emailContent);
  return emailContent;
}
function getReportContent() {
  var spreadsheetId = "1sSJhkbc_a9C4jY7wO1uVU1c7nR9qGW7HsK_-y0ftOzE";
  let monthyear = new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');
  var sheetName = monthyear+" Responses";
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  var currentDay = new Date();currentDay.setHours(7);
  
  
  //let {startRow, endRow }= findStartAndEndRows(sheet, new Date());
  //console.log(startRow, endRow);if (startRow==-1){return false;}
  //var data = sheet.getRange(startRow, 1, endRow - startRow, sheet.getLastColumn()).getValues();
  var data = getReports({grade:null,weekly:true}).array;
  
  var emailContent;
  emailContent = `<table class="defaultTable"><thead><tr><th scope="col">#</th><th scope="col">First</th><th scope="col">Last</th><th scope="col">Times</th><th scope="col">Count</th><th scope="col">Grade</th></tr></thead><tbody>`;//"<ul>";
  
  data.forEach(function(row,key) {
    var timestamp = row.dates;
    var firstname = row.firstname;
    var lastname = row.lastname;
    var grade = row.grade;
    var count = row.count;
    
    
    emailContent += `<tr><th scope="row">${key+1}</th><td>${firstname}</td><td>${lastname}</td><td>${timestamp}</td><td>${count}</td><td>${grade}</td></tr>`;
    
  });
  
  emailContent += `</tbody></table>`;//"</ul>";
  Logger.log(emailContent);
  return emailContent;
}

function getWeeklyReportD() {
    let e = cReponses(),
        t = new Date,
        $ = t.getDay(),
        n = new Date(t.setDate(t.getDate() - ($ >= 4 ? $ - 4 + 7 : $ + 3)));
    n.setHours(10, 0, 0, 0);
    let r = new Date(n.getTime() + 5184e5);
    return e.filter(e => {
        let t = new Date(e[0]);
        return t >= n && t <= r && t.getHours() >= 10
    })
}

function getWeeklyReportM() {
  let e = cReponses(),
        t = new Date,
        $ = t.getDay(),
        n = new Date(t.setDate(t.getDate() - ($ >= 4 ? $ - 4 + 7 : $ + 3)));
    n.setHours(8, 0, 0, 0);
    let r = new Date(n.getTime() + 5184e5);
    return e.filter(e => {
        let t = new Date(e[0]);
        return t >= n && t <= r && t.getHours() < 10
    })
}

function getWeeklyReportA() {
  
}

function sendToAttendance(e) {
    var name = "T. TOWNES";
    let day = getperiod().dayIndex;if (day==6 || day==0){return;}
    let eBody = createEmailBody({name:name,topicsHtml:getEmailContent(),body:'Here is the daily Tardy List for this morning!'});if(!eBody){status = 'Not Sent';return;}
    
    console.log(EMAIL_RECEPIENT,EMAIL_SUBJECT,createEmailBody(name));
    // If there is at least one topic selected, send an email to the recipient.
  let status = '';
  //if (topics.length > 0) {
    MailApp.sendEmail({
      to: EMAIL_RECEPIENT,
      subject: EMAIL_SUBJECT,
      htmlBody: eBody
    });
    //GmailApp.sendEmail(EMAIL_RECEPIENT,EMAIL_SUBJECT,createEmailBody(name));
    status = 'Sent';
    Logger.log(status);
  //}else {
  //  status = 'No topics selected';
  //}
    
}

function sendWeeklyReport(e) {
    var name = "A-Team";
    let day = getperiod().dayIndex;if (day==6 || day==0){return;}
    let eBody = createEmailBody({name:name,topicsHtml:getReportContent(),body:'Here is the Weekly "Tardy Detention List" for students with 4 or more! This list does not include late arrivals before 10am'});if(!eBody){status = 'Not Sent';return;}
    // If there is at least one topic selected, send an email to the recipient.
  let status = '';
  //if (topics.length > 0) {
    MailApp.sendEmail({
      to: EMAIL_RECEPIENT2,
      subject: "Weekly Tardy Report",
      htmlBody: eBody
    });
    //GmailApp.sendEmail(EMAIL_RECEPIENT,EMAIL_SUBJECT,createEmailBody(name));
    status = 'Sent';
    Logger.log(status);
  //}else {
  //  status = 'No topics selected';
  //}
    
}

function sendWeeklyMReport(e) {
    var name = "A-Team";
    let day = getperiod().dayIndex;if (day==6 || day==0){return;}
    let eBody = createEmailBody({name:name,topicsHtml:getReportData({values:getWeeklyReportM(),count:1}).output,body:'Here is the Weekly " Morning Tardy List" for students with 1 or more!'});if(!eBody){status = 'Not Sent';return;}
    // If there is at least one topic selected, send an email to the recipient.
  let status = '';
  //if (topics.length > 0) {
    MailApp.sendEmail({
      to: EMAIL_RECEPIENT3,
      subject: "Weekly Morning Tardy Report",
      htmlBody: eBody
    });
    //GmailApp.sendEmail(EMAIL_RECEPIENT,EMAIL_SUBJECT,createEmailBody(name));
    status = 'Sent';
    Logger.log(status);
  //}else {
  //  status = 'No topics selected';
  //}
    
}





