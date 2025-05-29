const Pass = {
    sheet_id: "1sSJhkbc_a9C4jY7wO1uVU1c7nR9qGW7HsK_-y0ftOzE",
    sheet: null,
    sheets: null,
    reasons:null,
    responses:null,
    cresponse:null,
    template: getTemplate(),
    appdata:appData||{},
    mYear:()=>{return new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');},
    _set: function(){
        this.sheet = (this.sheet) ? this.sheet : SpreadsheetApp.openById(this.sheet_id);
        this.reasons = (this.reasons) ? this.reasons : this.sheet.getSheetByName('Reasons').getDataRange().getValues();
        this.responses = (this.responses) ? this.responses : this.getResponses();
        this.cresponse = this.responses[0];
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
    getRowJsonHead: function(t, n) {
        if (t && n) {
            var e = t;
            for (var r = {}, g = 0; g < n.length; g++) r[n[g].toLowerCase()] = (String(e[g]).replace(/['\-`]/g, ''));
            return r;
        }
    },
    getSheetJson: function(t) {
        if (!t) return !1;
        var arr = t.getDataRange().getValues();
        if (!t) throw Error("Sheet not found.");
        for (var e = arr, n = e[0], a = [], l = 1; l < e.length; l++) {
            for (var r = {}, g = 0; g < n.length; g++) r[(n[g]).toLowerCase()] = (String(e[l][g]).replace(/['\-`]/g, ''))
            a.push(r)
        }
        var s = JSON.stringify(a);
        return {data:a,values:arr}
    },
    getResponses: function(){
      var sheets = this.sheet.getSheets();
      var jsonData = [];
      for (var i = 0; i < sheets.length; i++) {
        var sheet = sheets[i];
        var sheetName = sheet.getName();
        if (sheetName.toLowerCase().indexOf("responses") !== -1) {
          var r = this.getSheetJson(sheet);
          //let temp={};temp[sheetName]={["values"]: rows};
          jsonData.push({name:sheetName,data:r.data,values:r.values});
        }
      }
      return (jsonData);
    },
    isDuplicate2(e, t = 30) {
        this._set();
        let s = new Date().getTime() - 6e4 * t,
            n = this.cresponse.values.slice(1),
            i = new Map;
        for (let l = 0; l < n.length; l++) {
            n[l];
            let u = new Date(n[l][0]).getTime();
            if (u > s) {
                let $ = n[l][4];
                (!i.has($) || i.get($) < u) && i.set($, u)
            }
        }
        return i.has(e.studentnumber)
    },
    isDuplicate(e, t = 25) {
        this._set();
        let s = new Date().getTime() - 6e4 * t,
            n = this.cresponse.values;
        for (var l=n.length-1; l>=0; l--) {
        //for (let l = 0; l < n.length; l++) {
            let u = new Date(n[l][0]).getTime();
            if (n[l][4] == e.studentnumber && u > s) {
                return !0;
            }
        }
        return !1;
    },
    getLastPass(e) {
        this._set();
        let h = this.cresponse.values[0],
            n = this.cresponse.values;
        for (var l=n.length-1; l>=0; l--) {
            if (n[l][4] == e.studentnumber) {
                return this.getRowJsonHead(n[l],h);
            }
        }
        return !1;
    },
    getPassbyID(e) {
    this._set();
    let h = this.cresponse.values[0],
        t = this.cresponse.values.find(function (s) {
            return s[1] == e
        });
    if (t) return this.getRowJsonHead(t, h);
    throw Error(`No matching record found for ID '${e}'.`)
}
   
}

//SpreadsheetApp.openById("1HhUzi3vSi3Duk7aIdJKkE97HskNAbEaSAhurj387Iss")
function ptest() {
    //console.log(Pass.isDuplicate({studentnumber:2058747}));
    console.log((Pass.isDuplicate({studentnumber:2058747}))?Pass.getLastPass({studentnumber:2058747}):'No Pass');
}

