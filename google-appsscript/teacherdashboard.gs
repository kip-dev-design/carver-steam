const dheader = () => {return `
  <!-- Add Bootstrap CSS link here -->
  <link rel="stylesheet" href="https://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <style>
    html,
    body {
      overflow-x: hidden; /* Prevent scroll on narrow devices */
    }

    body {
      padding-top: 56px;
    }

    @media (max-width: 991.98px) {
      .offcanvas-collapse {
        position: fixed;
        top: 56px; /* Height of navbar */
        bottom: 0;
        left: 100%;
        width: 100%;
        padding-right: 1rem;
        padding-left: 1rem;
        overflow-y: auto;
        visibility: hidden;
        background-color: #343a40;
        transition: visibility .3s ease-in-out, -webkit-transform .3s ease-in-out;
        transition: transform .3s ease-in-out, visibility .3s ease-in-out;
        transition: transform .3s ease-in-out, visibility .3s ease-in-out, -webkit-transform .3s ease-in-out;
      }
      .offcanvas-collapse.open {
        visibility: visible;
        -webkit-transform: translateX(-100%);
        transform: translateX(-100%);
      }
    }

    .nav-scroller {
      position: relative;
      z-index: 2;
      height: 2.75rem;
      overflow-y: hidden;
    }

    .nav-scroller .nav {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: nowrap;
      flex-wrap: nowrap;
      padding-bottom: 1rem;
      margin-top: -1px;
      overflow-x: auto;
      color: rgba(255, 255, 255, .75);
      text-align: center;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
    }

    .nav-underline .nav-link {
      padding-top: .75rem;
      padding-bottom: .75rem;
      font-size: .875rem;
      color: #6c757d;
    }

    .nav-underline .nav-link:hover {
      color: #007bff;
    }

    .nav-underline .active {
      font-weight: 500;
      color: #343a40;
    }

    .bg-purple { background-color: #6f42c1; }
    .bg-maroon { background-color: rgba(132,13,17,1); }

    .lh-100 { line-height: 1; }
    .lh-125 { line-height: 1.25; }
    .lh-150 { line-height: 1.5; }

  </style>
  <script src="https://code.jquery.com/jquery-1.9.1.js" crossorigin="anonymous"></script>
  <script src="https://code.jquery.com/ui/1.10.3/jquery-ui.js" crossorigin="anonymous"></script>
  <script src="${currentmacro()}?action=get_js"></script>
  
  <script>

`;}
function viewDashboard(e) {
  console.log(e);
  return `
    ${dheader()}

    var apiUrl = "${currentmacro()}?action=active_passes";
    
    var monthyear = new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');
    // Function to fetch data from Google Sheets API and update the student list
    var currentDay = new Date();currentDay.setHours(0, 0, 0, 0); // Set time to the beginning of the day
    var teacher;
    var period;

    $(document).ready(function() {
      teacher="${e.teacher}";if(teacher=="undefined")teacher=null;
      period=getperiod();
      $("#studentList").on('click', 'li a', function(e) {
        e.preventDefault();
        // Disable the button
        $(this).addClass('disabled', e);
        //$(this).attr("aria-disabled", true);
        var passId = $(this).data("id");
        
        $.ajax({
          url: "${currentmacro()}",
          type: "GET",
          data: {
            action: "class_pass_returned",
            pass_id: passId
          },
          success: function(response) {
            // Handle success response
            console.log("Pass returned successfully:", response);
          },
          error: function(xhr, status, error) {
            // Handle error
            console.error("Error returning pass:", status, error);
          }
        });
      });
      $("#teacherperiod").text((teacher)?teacher.split(",")[0]+"'s "+period+" Class":"All Classes");
      $("#datemonth").html(monthyear);

    });

    function updateStudentList() {
      
      $.ajax({
            url: sheeturl("/values/" + monthyear.replace(' ', '-') + " Responses?alt=json"),
            type: "GET",
            success: function(data, textStatus, jqXHR) {
                //resobj = data.values;
                //12th #FF33FC 11th #007bff 10th #F9FC28 9th #F5411A
                var rows = data.values.slice(1);console.log(rows);
                var studentList = document.getElementById("studentList");
                studentList.innerHTML = ""; // Clear previous list
                rows = rows.filter(row => {var t = new Date(row[0]);return t.getTime() >= currentDay.getTime();});
                rows = filterData(rows, teacher);
                rows = sortByTimeDescending(rows);
                console.log(groupByPeriod(rows));
                console.log((rows));
                var currentTime = new Date();
                rows.map(row => {
                  let cc;
                  switch (row[5]){
                    case "9th":cc="#F5411A";break;case "10th":cc="#F9FC28";break;case "11th":cc="#007bff";break;case "12th":cc="#FF33FC";break;
                  }
                  var listItem = 
                  $("<li>").addClass("list-group-item d-flex justify-content-between align-items-center")
                    .append($("<div>").addClass("d-flex align-items-center").append($("<svg>").addClass("bd-placeholder-img mr-2 rounded")
                        .attr({width: "32", height: "32",xmlns: "http://www.w3.org/2000/svg",role: "img","aria-label": "Placeholder: 32x32",
                          preserveAspectRatio: "xMidYMid slice",focusable: "false"})
                        .append($("<title>").text("PlaceHolder"))  
                        .append($("<rect>").attr({ width: "100%", height: "100%", fill: cc }))
                        .append($("<text>").attr({ x: "50%", y: "50%", fill: "#007bff", dy: ".3em" }).text(row[5])))
                    .append($("<div>").addClass("ms-3").append($("<p>").addClass("fw-bold mb-1").text(row[6]+" "+row[7]))
                    .append($("<p>").addClass("text-muted mb-0").text(row[8])))
                    ).append(function(i) {if (teacher){return '<a class="btn btn-success" href="#" data-id="'+row[1]+'" role="button">Returned To Class</a>'}})
                    
                    .appendTo(studentList);
                  if (!listItem.hasClass("list-group-item-added")) {
                    listItem.addClass("list-group-item-added");
                    
                    // Send a browser notification
                    sendNotification(row[6]+" "+row[7]+" added to the list");
                  }
                  //listItem.addClass(checktime(row[0]));
                  listItem.hover(
                    function() {
                      $(this).addClass("bg-secondary");
                    },
                    function() {
                      $(this).removeClass("bg-secondary");
                    }
                  );
                });
            },
            complete: function(data) {
                //setTimeout(fetchdata, 5000);
                //setauto(resobj, allobj, titlelast, dayslast);
            }
        });

      
    }

    function checktime(t){
    var currentTime = new Date();
      var timestamp = new Date(t);
      var timeDifference = currentTime - timestamp;

      if (timeDifference > 6 * 60 * 1000) { // More than 6 minutes
        return ("list-group-item-danger");
      } else if (timeDifference > 4.5 * 60 * 1000) { // More than 4 minutes 30 seconds
        return ("list-group-item-warning");
      }
      return;
    }

    // Function to check for changes in the Google Sheets API every 5 seconds
    function checkForChanges() {
      // Initialize a variable to keep track of the previous data
      var previousData = null;

      // Function to check for changes
      function check() {
        
        $.ajax({
          url: sheeturl("/values/" + monthyear.replace(' ', '-') + " Responses?alt=json"),
          dataType: "json",
          success: function(response) {
            var currentData = JSON.stringify(response);

            if (currentData !== previousData) {
              // Update the student list if changes are detected
              updateStudentList();
              // Store the current data as the previous data for the next comparison
              previousData = currentData;
            }
          },
          error: function(xhr, status, error) {
            console.error("Error fetching data:", status, error);
          }
        });
      }

      // Call the check function every 5 seconds
      setInterval(check, 5000);
    }

      // Function to filter jsonData by teacher's name and class period && studentData[3] === classPeriod
      function filterData(data, teacherName) {
        return data.filter(function(studentData) {
          if(teacherName){return studentData[2] === teacherName && studentData[9] == null;}else{return studentData[2] != "n/a" && studentData[9] == null;}
          //return studentData[2] === teacherName && studentData[9] == null;
        });
      }
      function sortByTimeDescending(dataArray) {
        dataArray.sort(function(a, b) {
          var timestampA = new Date(a[0]);
          var timestampB = new Date(b[0]);
          return timestampB - timestampA; // Compare timestamps in descending order
        });

        return dataArray;
      }
            
      function groupByPeriod(dataArray) {
        var groupedData = {};

        dataArray.forEach(function(item) {
          var period = item[3]; // Period is at index [3]
          
          if (!groupedData[period]) {
            groupedData[period] = [];
          }
          
          groupedData[period].push(item);
        });

        return groupedData;
      }
      function sendNotification(message) {
  if (!("Notification" in window)) {
    console.log("Browser does not support notifications.");
    return;
  }

  // Request permission to send notifications
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        // Create and show the notification
        const notification = new Notification("Student Added", {
          body: message,
          icon: "path_to_your_icon.png" // Replace with the actual path to an icon image
        });

        // Automatically close the notification after a few seconds
        setTimeout(() => {
          notification.close();
        }, 5000); // 5 seconds
      }
    });
  }

    // Call the initial updateStudentList function to populate the student list on page load
    updateStudentList();

    // Call the checkForChanges function to start checking for changes every 5 seconds
    checkForChanges();

    ${getperiod.toString()}
    ${comparetime.toString()}
    ${dbody(e)}

    ${dfooter()}

  `;
}
const dbody = () => {return `
</script>
    <main role="main" class="container">
    <div class="d-flex align-items-center p-3 my-3 text-white-50 bg-maroon rounded shadow-sm">
      <img class="mr-3" src="https://drive.google.com/file/d/127gpSSO8qV7lik5fEwzhUzXJRvjkSdUm/view?usp=download" alt="" width="48" height="48">
      <div class="lh-100">
        <h6 class="mb-0 text-white lh-100">Carver Pass Tracker</h6>
        <small id="datemonth">Since 2011</small>
      </div>
    </div>

    <div class="my-3 p-3 bg-white rounded shadow-sm">
      <h6 id="teacherperiod" class="border-bottom border-gray pb-2 mb-0">Teacher's 2nd Period</h6>
      <div class="mt-4">
        <ul class="list-group" id="studentList">
          
          <!-- The student list will be populated dynamically through JavaScript -->
        </ul>
      </div>
      
      <small class="d-block text-right mt-3">
        <a href="#">All updates</a>
      </small>
    </div>

   
  </main>

`};

const dfooter = () => {return `
  
  <!-- Add Bootstrap JS and separate JavaScript file link here -->
  
  
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
  
`};




