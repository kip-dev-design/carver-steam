function doGet(e) {
  var data = JSON.parse(JSON.stringify(e.parameter));
  
  switch (data.type) {
    case "get":
      switch (data.action) {
        case "js":
          return ContentService.createTextOutput(javascript).setMimeType(ContentService.MimeType.JAVASCRIPT);
        case "incident_page":
          return ContentService.createTextOutput(JSON.stringify(Object.assign({}, data, {"url":currentmacro()}))).setMimeType(ContentService.MimeType.JSON);
        default:
          return ContentService.createTextOutput(JSON.stringify({"post_response":"Invalid action parameter","data":data})).setMimeType(ContentService.MimeType.JSON);
      }
    case "school":
      switch (data.action) {
        case "class":
          delete data.period;delete data.type,delete data.action;
          if (data.studentnumber){data={...SI.getStudentDetails(data),...SI.getStudentClass(data)}}
          return ContentService.createTextOutput(JSON.stringify({"post_response":"success","data":data})).setMimeType(ContentService.MimeType.JSON);
        case "active":
          return ContentService.createTextOutput(javascript).setMimeType(ContentService.MimeType.JAVASCRIPT);
        default:
          return ContentService.createTextOutput(JSON.stringify({"post_response":"Invalid action parameter","data":data})).setMimeType(ContentService.MimeType.JSON);
      }
    case "pass":
      switch (data.action) {
        case "validate":
          return HtmlService.createHtmlOutput(validate_pass(data)).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        case "active":
          return ContentService.createTextOutput(JSON.stringify({values:getactivepasses()})).setMimeType(ContentService.MimeType.JSON);
        case "post_response":
          if (Pass.isDuplicate(data)){delete data.period;return ContentService.createTextOutput(JSON.stringify({"post_response":"Duplicate", "data":{...data,...{pass:Pass.getLastPass(data)},...SI.getStudentDetails(data),...SI.getStudentClass(data)}})).setMimeType(ContentService.MimeType.JSON);}
          let id = generateID(14);data.id=id;
          if (create_post({data:[data.id,data.teacher,data.period,data.studentnumber,data.grade,data.firstname,data.lastname,data.reason],frm_id:"1Ik6VET_Up8BxVvOvZJBgvLORRt_1--ev2ifD8oyBr_Q"})) {
            delete data.period;delete data.type,delete data.action;
            if (data.studentnumber){data={...SI.getStudentDetails(data),...SI.getStudentClass(data)}}
            if(data.print_pass==true||data.print_pass=="true"){
              try{addToPrintList(data);}
              catch(e){Logger.log(e);}
              finally{Logger.log(data);}
            }
          }
          return ContentService.createTextOutput(JSON.stringify({"post_response":"success","data":data,"pass_id":id})).setMimeType(ContentService.MimeType.JSON);
        case "view_dashboard":
          return HtmlService.createHtmlOutput(viewDashboard(data)).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        default:
          return ContentService.createTextOutput(JSON.stringify({"post_response":"Invalid action parameter","data":data})).setMimeType(ContentService.MimeType.JSON);
      }
    case "incident":
      switch (data.action) {
        case "validate":
          return HtmlService.createHtmlOutput(validate_pass(data)).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        case "html":
          delete data.type,delete data.action;
          data = Object.assign(data,("sessionID" in data && data.sessionID)?data.sessionID:{"sessionID":generateID(26)});
          return HtmlService.createHtmlOutput(IR.getHtml(data)).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        case "post_response":
          let id = generateID(15);data.id=id;
          console.log(data);Logger.log(data);
          if ( create_post({"data":[data.id, data.offense_type, data.teacher_id, data.teacher_firstname, data.teacher_lastname, data.time, data.location, data.arrangement, data.offense, data.description,
          data.incident_action, data.action_duration, data.details, data.period, data.day, data.studentnumber, data.grade, data.student_firstname, data.student_lastname],"frm_id": "1S5v7UF0rDPGTEVfQ1DbmJhJbd6qq0xeaL_82FWYby08"})) {
            if (data.studentnumber){data={...SI.getStudentDetails(data),...SI.getStudentClass(data)}}
          }
          return ContentService.createTextOutput(JSON.stringify({"post_response":"success","data":data})).setMimeType(ContentService.MimeType.JSON);
        case "view_dashboard":
          return HtmlService.createHtmlOutput(viewDashboard(data)).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        default:
          return ContentService.createTextOutput(JSON.stringify({"post_response":"Invalid action parameter","data":data})).setMimeType(ContentService.MimeType.JSON);
      }
    default:
      return ContentService.createTextOutput(JSON.stringify({"post_response":"Invalid type parameter","data":data})).setMimeType(ContentService.MimeType.JSON);
  }

}
