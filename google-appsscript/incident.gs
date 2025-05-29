const IR = {
    sheet_id: "1lqVGnN1vV-cRE7sueL32HmSEFdGWbxAcuVFie6AViAI",
    sheet:null,
    sheets:{steps:null,html:null},
    _set:function(){
        this.sheet = (this.sheet) ? this.sheet : SpreadsheetApp.openById(this.sheet_id);
        this.sheets.steps = (this.sheets.steps) ? this.sheets.steps : this.sheet.getSheetByName('Steps').getDataRange().getValues(),
        this.sheets.html = (this.sheets.html) ? this.sheets.html : this.sheet.getSheetByName('Html').getDataRange().getValues()
    },
    template: getTemplate(),
    getSteps:function(){
          this._set();
          let html='';
          console.log(this.stepsWrapped);
          const steps = this.sheets.steps;
          steps.map(function (a,i){
            let e = JSON.parse(a[0]);
            let w = `
          <!-- Step ${e.title} -->
          <div class="step${(e.active)?` active`:``}">
              <div class="card-stats card">
                  <div class="card-body">
                      <div class="row">
                          <div class="col">
                              <div class="numbers head">
                                  <p class="card-title">${e.title}</p>
                                  <p></p>
                              </div>
                          </div>
                      </div>
                      <div class="row">
                          <div class="col-12 col-md-12">
                              <div class="form-group">
                                  {{content}}
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="card-footer mt-5">
                      <div class="row nav mb-3 mx-auto">
                          <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                              <div class="btn-group btn-group-lg d-flex justify-content-between" role="group">
                                  <button type="button" ${(e.buttons.prev.enabled)?'':'style="display:none;"'} class="btn btn-outline-secondary prev-btn">${e.buttons.prev.title}</button>
                              </div>
                          </div>
                          <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                              <div class="btn-group btn-group-lg d-flex justify-content-between" role="group">
                                  <button type="button" ${(e.buttons.next.enabled)?'':'style="display:none;"'}class="btn btn-success next-btn">${e.buttons.next.title}</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <!-- End Step -->`;
            w=w.replace(`{{content}}`, a[1]);
            html+=w;
          });
          return html;
      },
    getContent:function(){
        return `<div class="mx-auto col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-6">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <div class="card-stats card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-12 col-md-12">
                                    <div class="mb-3 position-relative ">
                                        <div class="position-relative ">
                                            <div class="progress d-flex align-items-center pt-2 pb-2 my-0 text-white bg-purple rounded shadow-sm" id="progress">
                                                <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-0">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <form id="multiStepForm">
                      ${this.getSteps()}
                      <!-- Step Review -->
                      <div class="step">
                        <div class="card-stats card review">
                        <div class="card-body">
                          <div class="row">
                              <div class="col">
                                <div class="numbers head">
                                  <p class="card-title">Review & Submit</p>
                                  <p></p>
                                </div>
                              </div>
                          </div>
                          <div class="row">
                            <div class="col-12 col-md-12">
                              <div class="form-group">
                                  
                                      <div id="review" class="list-group list overflow-auto">
                                          <input type='hidden' class="form-control" id="review_input" value="null" />
                                      </div>
                                      <div id="info" class="jumbotron jumbotron-fluid justify-content-center" style="display: none;">
                                        <div class="container">
                                            <h2 class="display-4">Thanks Report Sent! <i class="fa fa-check"></i></h2>
                                            <h3 id="sname" class="display-6">Student Name</h3>
                                            <h4 id="currentperiod" class="display-6">Period</h4>
                                            <h4 id="timestamp" class="display-6">Time Stamp</h4>
                                            <p class="lead"></p>
                                        </div>
                                    </div>													
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="card-footer mt-5">
                          <div id="reviewbuttons" class="row nav mb-3 mx-auto">
                            <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                                <div class="btn-group btn-group-lg d-flex justify-content-between" role="group" aria-label="...">
                                  <button type="button" class="btn btn-outline-secondary prev-btn"><i class="fa fa-arrow-left"></i></button>
                                </div>
                            </div>
                            <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                                <div class="btn-group btn-group-lg d-flex justify-content-between" role="group" aria-label="...">
                                  <button type="submit" class="btn btn-success"><i class="fa fa-check"></i></button>
                                </div>
                            </div>
                          </div>	
                        </div>
                      </div>
                      </div>
                      <!-- End Step -->
                      <input type='hidden' name="offense_type" id="type" value="null" />
                      <input type='hidden' class="form-control" name="description" id="description" value="null" />
                      <input type='hidden' class="form-control" name="period" id="period" value="null" />
                      <input type='hidden' class="form-control" name="day" id="day" value="null" />
                      <input type='hidden' class="form-control" name="type" value="incident" />
                      <input type='hidden' class="form-control" name="action" value="post_response" />
                    </form>
                </div>
            </div>
        </div>`;
      },

    getHtml: function(e={}){
        this._set();
        var html = this.template;
        const hrows = this.sheets.html;
        hrows.map(function (a){html=html.replaceAll(`{{${a[0]}}}`, a[1]); });
        html=html.replaceAll(`{{head_meta}}`, '');
        html=html.replaceAll(`{{app_data}}`, this.getAppdata(e)); 
        html=html.replaceAll(`{{content}}`, this.getContent()); 
        return html;
    },
    appdata:appData||{},
    mYear:()=>{return new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');},
    
    getAppdata: function(e){
      let a = {...this.appdata,...e};
      return `<script type="text/javascript">
      var AppData = ${JSON.stringify(a)}
      </script>`
    },
    getRowJson: function(t, i) {
        if (t && i) {
            var e = t,
                n = e[0],
                a = [];
            for (var r = {}, g = 0; g < n.length; g++) r[n[g].toLowerCase()] = (e[i][g].replace(/['\-`]/g, ''));
            return r;
        }
    },
    


}

//SpreadsheetApp.openById("1HhUzi3vSi3Duk7aIdJKkE97HskNAbEaSAhurj387Iss")
function itest() {
    console.log(IR.getHtml({
        "studentnumber": 2128662,
        "period": 7
    }));
}
