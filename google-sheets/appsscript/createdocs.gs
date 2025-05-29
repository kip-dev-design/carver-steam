var words=[]; words[0]="zero",words[1]="One",words[2]="Two",words[3]="Three",words[4]="Four",words[5]="Five",words[6]="Six",words[7]="Seven",words[8]="Eight",words[9]="Nine",words[10]="Ten",words[11]="Eleven",words[12]="Twelve",words[13]="Thirteen",words[14]="Fourteen",words[15]="Fifteen",words[16]="Sixteen",words[17]="Seventeen",words[18]="Eighteen",words[19]="Nineteen",words[20]="Twenty",words[30]="Thirty",words[40]="Forty",words[50]="Fifty",words[60]="Sixty",words[70]="Seventy",words[80]="Eighty",words[90]="Ninety",words[100]="One Hundred",words[200]="Two Hundred",words[300]="Three Hundred",words[400]="Four Hundred",words[500]="Five Hundred",words[600]="Six Hundred",words[700]="Seven Hundred",words[800]="Eight Hundred",words[900]="Nine Hundred";

function setfolder(parentid,newname) {
  let path = (parentid) ? DriveApp.getFolderById(parentid).getFoldersByName(newname) : DriveApp.getFoldersByName(newname);
  var f = path.hasNext() ? path.next() : DriveApp.getFolderById(parentid).createFolder(newname);
  //console.log(path);
  //console.log(f);
  //console.log(f.getId());
  return f;
}

function getDetentionDate() {
    let e = new Date,t = e.getDay(),n = 5 - t; t > 5 && (n += 7);
    let a = new Date(e);
    return a.setDate(e.getDate() + n), a.setHours(14, 30, 0, 0), a.toLocaleString('en-US', {weekday: 'long',month: 'short',day: 'numeric',year: 'numeric'})
}

function makeDetentionNotice(e = {}) {
    e.folder = getDetentionFolder();
    e.template = DriveApp.getFileById('1agy7xsaYFzVAnAkLQNkZq_MUZauxJAh_8asGW09V4mA');
    e.name = 'Detention Letter'
    var data = getReports({grade:null,weekly:true}).array;
    for (let i =0; i < data.length;i++) {
      let r = data[i];
       //emailContent += `<tr><th scope="row">${key+1}</th><td>${firstname}</td><td>${lastname}</td><td>${timestamp}</td><td>${count}</td><td>${grade}</td></tr>`;
      maketemplate(Object.assign(e,{info:r}))
    };

    function maketemplate(e){
      //Using the row data in a template literal, we make a copy of our template document in our destinationFolder
      var filename = `${e.info.firstname} ${e.info.lastname} - ${e.name}`;
      const copy = e.template.makeCopy(filename ,DriveApp.getFolderById(e.folder.id))
      //Once we have the copy, we then open it using the DocumentApp
      const doc = DocumentApp.openById(copy.getId())
      //All of the content lives in the body, so we get that for editing
      const body = doc.getBody();
      setstatic(body);//agency_name
      body.replaceText('{{detention_date}}', getDetentionDate());
      body.replaceText('{{tardy_num}}', words[e.info.count]);
      body.replaceText('{{firstname}}', e.info.firstname);
      body.replaceText('{{lastname}}', e.info.lastname);
      //In this line we do some friendly date formatting, that may or may not work for you locale
      //rows.map(function (a,i){ body.replaceText(`{{${a[0]}}}`, a[1]); });
      //Object.entries(account).map(function (a,i){ body.replaceText(`{{${a[0]}}}`, a[1]); });
      //We make our changes permanent by saving and closing the document
      //let docblob = doc.getAs('application/pdf');
      //doc.getAs('application/pdf').setName(doc.getName() + ".pdf");
      doc.saveAndClose();
      //var ui = SpreadsheetApp.getUi();
      //if (ui.alert('Save As PDF?','Save current document (Name:'+doc.getName()+'.pdf) as PDF',ui.ButtonSet.YES_NO) == ui.Button.YES) {
        DriveApp.getFolderById(DriveApp.getFileById(doc.getId()).getParents().next().getId()).createFile(doc.getAs('application/pdf').setName(doc.getName() + ".pdf"));
        Drive.Files.remove(doc.getId());
      //}
    }
}

function getDetentionFolder(){
    var t, d;
    let l = () => new Date(Date.now()).toLocaleString("en-US", {month: "short",year: "numeric"}).replace(/\s+/g, "-"),
        r = {id: "1YIP80MHzl7vZsSzmGqHQRMUfzS8GGZfd",name: l()},
        o = new Date().getWeekOfMonth() + 1;
    DriveApp.getFolderById(r.id).getFoldersByName(r.name).hasNext() ? t = DriveApp.getFolderById(r.id).getFoldersByName(l()) : (t = DriveApp.getFolderById(r.id).createFolder(r.name), d = DriveApp.getFolderById(t.getId()).createFolder(o), Logger.log("Folder created successfully.")), d = "next" in t ? t.next() : t;
    Logger.log(d.getId())
    let g;
    return DriveApp.getFolderById(d.getId()).getFoldersByName(o).hasNext() ? g = DriveApp.getFolderById(d.getId()).getFoldersByName(o) : (g = DriveApp.getFolderById(d.getId()).createFolder(o), Logger.log("Folder created successfully.")), "next" in g ? {id:g.next().getId(),name:String(o)} : {id:g.getId(),name:String(o)}
}

function testt(){
  //let fldr=makeDetentionNotice();
  console.log(getDetentionDate());
}

function createDocs(e) {
  //This value should be the id of your document template that we created in the last step
  console.log(e);
    
  const googleDocTemplate = DriveApp.getFileById(e.id);
  //Here we store the sheet as a variable
  const rows = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('info').getDataRange().getValues() ;
  const row = JSON.parse(JSON.stringify(Object.fromEntries(rows)));console.log(rows,row);
  
  function maketemplate(e){
    //Using the row data in a template literal, we make a copy of our template document in our destinationFolder
    console.log(e)
    var filename = `${row.F} ${row.last} - ${e.name} ${e.agen}`;
    const copy = googleDocTemplate.makeCopy(filename , setfolder(e.folder.id,e.folder.name) )
    //Once we have the copy, we then open it using the DocumentApp
    const doc = DocumentApp.openById(copy.getId())
    //All of the content lives in the body, so we get that for editing
    const body = doc.getBody();
    setstatic(body);//agency_name
    body.replaceText('{{agency_name}}', e.agen);
    body.replaceText('{{account_info}}', getaccounts(e.agen));
    body.replaceText('{{inquiries_info}}', getinquiries(e.agen));
    //In this line we do some friendly date formatting, that may or may not work for you locale
    rows.map(function (a,i){ body.replaceText(`{{${a[0]}}}`, a[1]); });
    Object.entries(account).map(function (a,i){ body.replaceText(`{{${a[0]}}}`, a[1]); });
    //We make our changes permanent by saving and closing the document
    //let docblob = doc.getAs('application/pdf');
    //doc.getAs('application/pdf').setName(doc.getName() + ".pdf");
    doc.saveAndClose();
    var ui = SpreadsheetApp.getUi();
    if (ui.alert('Save As PDF?','Save current document (Name:'+doc.getName()+'.pdf) as PDF',ui.ButtonSet.YES_NO) == ui.Button.YES) {
      DriveApp.getFolderById(DriveApp.getFileById(doc.getId()).getParents().next().getId()).createFile(doc.getAs('application/pdf').setName(doc.getName() + ".pdf"));
      Drive.Files.remove(doc.getId());
    }
    
    
  }

  if (e.name.toLowerCase().includes("dispute")){
  agencies.map(function(agen){
    maketemplate(Object.assign(e, {agen:agen}))
  })
  }else{maketemplate(Object.assign(e, {agen:''}))}
  //Store the url of our new document in a variable
 // const url = doc.getUrl();
  //Write that value back to the 'Document Link' column in the spreadsheet. 
  //sheet.getRange(index + 1, 6).setValue(url);
}


function setstatic(body){
  body.replaceText('{{nowdate}}', getDate().now);
  body.replaceText('{{month}}', getDate().month);
  body.replaceText('{{Month}}', getDate().monthlong);
  body.replaceText('{{Day}}', getDate().day);
  body.replaceText('{{year}}', getDate().year);
  
}
