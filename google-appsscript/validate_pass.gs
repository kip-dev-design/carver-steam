function validate_pass(e) {
  console.log(e);
  var html = getTemplate();
  let ad = {...appData,...{}};
  let p = getPassbyID(e.pass_id);
  html=html.replaceAll(`{{head_meta}}`, '');
  html=html.replaceAll(`{{stylesheet}}`, `<style>.main-panel {width: 100% !important;}.bg-blur {width: 100vw;height: 100%;z-index: -1;left: 0;position: absolute;backdrop-filter: blur(8px);}</style>`);
  html=html.replaceAll(`{{head_end}}`, '');
  html=html.replaceAll(`{{app_data}}`, `<script type="text/javascript">var AppData = ${JSON.stringify(ad)}</script>`);
  html=html.replaceAll(`{{body_start}}`, '');
  html=html.replaceAll(`{{content}}`, ()=>{
    return `
      <div id="pass" class="jumbotron jumbotron-fluid p-0 m-0" style=""> 
        <div class="container">
          ${ispassvalid(p)}
          <h3 id="studentname" class="display-6">${p.firstname} ${p.lastname}</h3> 
          <h4 id="currentperiod" class="display-6">${getperiod(p.timestamp).text}</h4> 
          <h4 id="timestamp" class="display-6">${now(p.timestamp)}</h4> 
          <p id="studentreason" class="lead">Reason: ${p.reason}</p>
        </div>
      </div>
    `;
  }); 
  html=html.replaceAll(`{{body_end}}`, '');
  return html;
}

function ispassvalid(data) {
  var timeValue = Date.parse(data.timestamp);
  var currentTime = new Date().getTime();
  var sixMinutesInMillis = 6 * 60 * 1000; // 6 minutes in milliseconds
  var isValid = currentTime - timeValue < sixMinutesInMillis;
  if (isValid) {
    return `<div class="alert alert-success" role="alert"><h2 class="display-4">Pass is Valid!</h2></div>`;
  } else {
    return `<div class="alert alert-danger" role="alert"><h2 class="display-4">Pass is Not Valid!</h2></div>`;
  }

}
