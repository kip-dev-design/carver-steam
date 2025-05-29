var spreadsheetId = "1sSJhkbc_a9C4jY7wO1uVU1c7nR9qGW7HsK_-y0ftOzE";
var formId = "1Ik6VET_Up8BxVvOvZJBgvLORRt_1--ev2ifD8oyBr_Q";

function monthYear(){return new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');}
const prevMonthYear=()=>{let e=new Date;return e.setMonth(e.getMonth()-1),e.toLocaleString("en-US",{month:"short",year:"numeric"}).replace(/\s+/g,"-")};
function deleteAllRowsInSheet(e){if(!e)return;return SpreadsheetApp.openById(spreadsheetId).getSheetByName(e).getDataRange().clearContent(),!0}
function cReponses(){
  let data = SpreadsheetApp.getActive().getSheetByName(monthYear()+" Responses").getDataRange().getValues();
  //day: "numeric",
  return (new Date(data[data.length - 1][0]).toLocaleString('en-US', {day: 'numeric'}) < 10)?SpreadsheetApp.getActive().getSheetByName(prevMonthYear()+" Responses").getDataRange().getValues().concat(data):data;
}
function addToPrintList(data) {
  var sheetName = 'Print_List';
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {sheet = spreadsheet.insertSheet(sheetName);}
  //let info = getPassbyID(data.pass_id)
  sheet.appendRow(data);
  
  Logger.log(`${data[1]} Entry added successfully.`);
  return true;
}

function getSheet(sheetName){
  var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);SpreadsheetApp.flush();
  if (!sheet) {sheet = SpreadsheetApp.getActive().insertSheet(sheetName);}
  var data = sheet.getDataRange().getValues();
  var headers = data[0].map(function (header) {return header.toString().toLowerCase();});
  return {sheet:sheet,values:data,headers:headers};
}

function checkAndUpdateSheet(){
  var e=SpreadsheetApp.getActive();
  let d = new Date;
  if(1 == d.getDate()){
    var t=FormApp.openById(formId);
    t.removeDestination(),SpreadsheetApp.flush();t.deleteAllResponses();SpreadsheetApp.flush();
    t.setDestination(FormApp.DestinationType.SPREADSHEET,e.getId());SpreadsheetApp.flush();
    let s=t.getEditUrl().replace("edit","viewform");n=e.getSheets().find(e=>e.getFormUrl()==s);
    n&&n.setName(monthYear()+" Responses")
  }
}


/**
 * Checks if the current time is within a specified time range.
 * @param {string} startTime - The start time of the range in the format "HH:mm".
 * @param {string} endTime - The end time of the range in the format "HH:mm".
 * @returns {boolean} True if the current time is within the specified range, false otherwise.
 */
function isTimeInRange(startTime,endTime) {
  var now = new Date();
  var currentHour = now.getHours();
  var currentMinute = now.getMinutes();

  var startHour = parseInt(startTime.split(':')[0]);
  var startMinute = parseInt(startTime.split(':')[1]);
  
  var endHour = parseInt(endTime.split(':')[0]);
  var endMinute = parseInt(endTime.split(':')[1]);

  if (
    (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
    (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute))
  ) {
    return true;
  }
  
  return false;
}

const testtime = () => {let o =getperiod(); console.log(o)}

function is202(e, n, s = 20) {
    // Helper function to convert time string "HH:MM" to a Date object with today's date
    function convertToTimeToday(time) {
        const [hours, minutes] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds
        return date;
    }

    // Get the current time
    const currentTime = new Date();

    // Convert input times to Date objects with today's date
    const eTime = convertToTimeToday(e);
    const nTime = convertToTimeToday(n);

    // Calculate the time difference in milliseconds
    const timeDifference = 60000 * s;

    // Check if the current time is within the specified minutes of e time or n time
    return Math.abs(currentTime - eTime) <= timeDifference || Math.abs(currentTime - nTime) <= timeDifference;
}

function getperiod(a=Date.now()){
          function getDayOfWeek(a){return["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][a]}
          function getTime12Hour(t){let[_,e]=t.split(":"),m=parseInt(_,10);return parseInt(e,10),`${m%12||12}:${e}${m>=12?"pm":"am"}`}
          function is20(n, t = 20) {let s = new Date,e = function n(t) {let [s, e] = t.split(":").map(Number), r = new Date;return r.setHours(s, e, 0, 0), r }(n);return Math.abs(s - e) <= 6e4 * t}
          function setup(t,e){e.is2020=(is20(t[0])||is20(t[1]));e.first20=is20(t[0]);e.start=t[0];e.end=t[1];return e;}
    		  const d=new Date(a);
          let schedule = {
            A:{ 
                1:["08:00","10:00"],
                2:["10:01","11:35"],
                A:["11:36","12:20"],
                3:["12:21","14:25"],
                4:["14:26","16:00"]
            },
            B:{
                1:["08:00","10:00"],
                2:["10:01","11:35"],
                A:["11:36","12:20"],
                3:["12:21","14:25"],
                4:["14:26","16:00"]
            },
            C:{
                1:["08:00","09:00"],
                2:["09:01","09:40"],
                3:["09:41","10:20"],
                4:["10:21","11:00"],
                5:["11:01","11:40"],
                6:["11:41","12:20"],
                7:["12:21","13:00"],
                8:["13:01","14:15"]
            },
          } 
          let day=d.getDay(); 
          let hour=("0"+d.getHours()).slice(-2); 
          let min=("0"+d.getMinutes()).slice(-2); 
          let time=hour + ":" + min;
          let o = {
            period: null,
            periodnum: null,
            day: null,
            dayIndex: day,
            dow: getDayOfWeek(day),
            time: getTime12Hour(time),
            text: null,
            school: true,
            is2020: false,
            first20:null,
            start: null,
            end:null
            
          };
          if (day==1 || day==3){
              o.day = "A-Day";
              if (comparetime("1:00", "8:00", time)){o.school=false;o.period="0";o.periodnum=o.period.charAt(0);o.text="Before School "+o.day;return o}
              if (comparetime("08:00", "10:00", time)){o=setup(schedule.A[1],o);o.period="1st";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              if (comparetime("10:01", "11:35", time)){o=setup(schedule.A[2],o);o.period="3rd";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              if (comparetime("11:36", "12:20", time)){o=setup(schedule.A['A'],o);o.period="Acceleration";o.periodnum=o.period.charAt(0);o.text=o.period+" "+o.day;return o;}
              if (comparetime("12:21", "14:25", time)){o=setup(schedule.A[3],o);o.period="5th";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              if (comparetime("14:26", "16:00", time)){o=setup(schedule.A[4],o);o.period="7th";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              else{o.school=false;o.period="After School";o.periodnum=o.period.charAt(0);o.text=o.period+" "+o.day;return o;}
          }
          if (day==2 || day==4){
              o.day = "B-Day";
              if (comparetime("1:00", "8:00", time)){o.school=false;o.period="0";o.periodnum=o.period.charAt(0);o.text="Before School "+o.day;return o}
              if (comparetime("08:00", "10:00", time)){o=setup(schedule.B[1],o);o.period="2nd";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              if (comparetime("10:01", "11:35", time)){o=setup(schedule.B[2],o);o.period="4th";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              if (comparetime("11:36", "12:20", time)){o=setup(schedule.B['A'],o);o.period="Acceleration";o.periodnum=o.period.charAt(0);o.text=o.period+" "+o.day;return o;}
              if (comparetime("12:21", "14:25", time)){o=setup(schedule.B[3],o);o.period="6th";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              if (comparetime("14:26", "16:00", time)){o=setup(schedule.B[4],o);o.period="8th";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              else{o.school=false;o.period="After School";o.periodnum=o.period.charAt(0);o.text=o.period+" "+o.day;return o;}
          }
          if (day==5){
              o.day = "C-Day";
              if (comparetime("1:00", "8:00", time)){o.school=false;o.period="0";o.periodnum=o.period.charAt(0);o.text="Before School "+o.day;return o}
              if (comparetime("08:00", "09:00", time)){o=setup(schedule.C[1],o);o.period="1st";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              if (comparetime("09:01", "09:40", time)){o=setup(schedule.C[2],o);o.period="2nd";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              if (comparetime("09:41", "10:20", time)){o=setup(schedule.C[3],o);o.period="3rd";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              if (comparetime("10:21", "11:00", time)){o=setup(schedule.C[4],o);o.period="4th";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              if (comparetime("11:01", "11:40", time)){o=setup(schedule.C[5],o);o.period="5th";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              if (comparetime("11:41", "12:20", time)){o=setup(schedule.C[6],o);o.period="6th";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              if (comparetime("12:21", "13:00", time)){o=setup(schedule.C[7],o);o.period="7th";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              if (comparetime("13:01", "14:15", time)){o=setup(schedule.C[8],o);o.period="8th";o.periodnum=o.period.charAt(0);o.text=o.period+" Period "+o.day;return o;}
              else{o.school=false;o.period="After School";o.periodnum=o.period.charAt(0);o.text=o.period+" "+o.day;return o;}
          }else{o.school=false;o.period="No School";o.periodnum=o.period.charAt(0);o.text=o.period;return o;}
        
}


function comparetime(e,n,r){return e<n?r>e&&r<n:r>e||r<n}

function getDayOfWeek(a){return["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][a]}

function getTime12Hour(t){let[_,e]=t.split(":"),m=parseInt(_,10);return parseInt(e,10),`${m%12||12}:${e}${m>=12?"pm":"am"}`}

function getTimeIn12HourFormat(time) {
  const [hour, min] = time.split(":");
  const hh = parseInt(hour, 10);
  const mm = parseInt(min, 10);
  const ampm = hh >= 12 ? "pm" : "am";
  const hours12 = hh % 12 || 12;

  return `${hours12}:${min}${ampm}`;
}

function isPassDuplicate(studentData,minutes=15) {
  let monthyear = new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');
  var sheetName = monthyear+" Responses";
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName(sheetName);
  let currentTime = new Date();
  
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  values = values.slice(1).map(e=>{return e});
  values = values.filter(e=> new Date(e[0])> currentTime.getTime() - minutes * 60 * 1000);
  var targetArray = values.filter(e=> studentData.first==e[6]&&studentData.last==e[7]); // Replace this with your actual array of codes
  //Logger.log(targetArray);
  // Iterate through the dataset and find the last occurrence of the student
  return targetArray.length>0?!0:!1;
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
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName(sheetName);
  // Get the data range in the sheet
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  values = values.slice(1).map(e=>{return e[1]});
  var targetArray = values; // Replace this with your actual array of codes

  return targetArray.indexOf(code) !== -1;
}

function getstudentDetails(data) {
  let students = getallstudents();
  if (data.studentnumber) {
    const numberMatch = students.find(student => student.studentnumber === data.studentnumber);
    if (numberMatch) {
      return Object.assign(data, numberMatch);
    }
  }

  const nameMatch = students.find(student => {
    const firstNameMatch = student.firstname.toLowerCase().replace(/['\-`]/g, '') === data.first.toLowerCase().replace(/['\-`]/g, '');
    const lastNameMatch = student.lastname.toLowerCase().replace(/['\-`]/g, '') === data.last.toLowerCase().replace(/['\-`]/g, '');
    return firstNameMatch && lastNameMatch;
  });

  return nameMatch ? Object.assign(data, nameMatch) : data;
}

function getallstudents(){
  return SI.getStudentsAsJSON();
}

function test2(){
  var spreadsheetId = "1sSJhkbc_a9C4jY7wO1uVU1c7nR9qGW7HsK_-y0ftOzE";
  let monthyear = new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');
  var sheetName = monthyear+" Responses";
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  Logger.log(getperiod())
}

function findStartAndEndRows(sheet=SpreadsheetApp.openById(spreadsheetId).getSheetByName('Aug-2024 Responses'), currentDay=new Date()) {
  let startRow = -1;
  let endRow = -1;
  currentDay.setHours(7);
  sheet.getRange(1, 1, sheet.getLastRow(), 3).getValues().find(function(row, key) {
    var time = new Date(row[0]).getTime();
    var teacher = row[2];
    if (time >= currentDay.getTime() && teacher.length < 4) {
      startRow = key+1;
      return true;
    }
    // Check if time is today or greater and teacher is 'n/a'
  });
  //Logger.log(getperiod().dayIndex);
  if(getperiod().dayIndex==5){currentDay.setHours(9, 01, 0, 0)}else{currentDay.setHours(9, 59, 0, 0)}
  //currentDay.setHours(9, 59, 0, 0);
  sheet.getRange(startRow, 1, sheet.getLastRow(), 3).getValues().find(function(row, key) {
    var time = new Date(row[0]).getTime();
    var teacher = row[2];
    if (time >= currentDay.getTime() && teacher.length < 4) {
      endRow = key;// - 2;
      return true;
    }
    // Check if time is today or greater and teacher is 'n/a'
  });
  //console.log(startRow, endRow);
  endRow = (endRow==-1)?sheet.getLastRow():endRow+startRow;
  return { startRow, endRow };
}

function getCurrentClasses() {
  let term = 3;
  var periodNum = getperiod().period.charAt(0);if(periodNum=='A'){periodNum='INTV'}
  Logger.log(periodNum);
  var sheetName = 'masterSchedule'; // Replace with the name of your sheet
  var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);

  // Get all values from the sheet
  var data = sheet.getDataRange().getValues().slice(1);Logger.log(data.length);
  // Filter the list where column 10 (index 9 in a zero-based index) equals 3
  var filteredData = data.filter(function(row) {
    //Logger.log(row[8]);//return;
    //let f = row[8].includes(term);Logger.log(f);
    return row[10] == periodNum && row[8].includes(term);
  });

  // Log the filtered data (you can do further processing or return it as needed)
  Logger.log(filteredData.length);
  return filteredData;
}


function getstudentclass(id=2038220){
    
    var data = SpreadsheetApp.getActive().getSheetByName('studentSchedules').getDataRange().getValues().slice(1);

    let schedule = getCurrentClasses();

    let sclass = schedule.filter(function(row){
        //Logger.log(row[2]);
        let flist = data.filter(function(d){return row[2]==d[1]&&d[8]==id&&d[3]=='E'});
        Logger.log(flist);
    })
    Logger.log(sclass);
}

function getDate(date=new Date()) {
  const now = date;
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = daysOfWeek[date.getDay()];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
  const shortMonthName = monthNames[now.getMonth()].substr(0, 3);
  const longMonthName = monthNames[now.getMonth()];
  const year = now.getFullYear();
  const dateInfo = {
    now: now.toLocaleDateString(),
    month: shortMonthName,
    monthlong: longMonthName,
    day: day,
    year: year
  };
  return dateInfo;
}
