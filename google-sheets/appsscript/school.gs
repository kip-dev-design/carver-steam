
const SI = {
    sheet_id: "1HhUzi3vSi3Duk7aIdJKkE97HskNAbEaSAhurj387Iss",
    sheet: null,
    sheets: null,
    students: null,
    staff: null, 
    schedule: {
        "master": null, 
        "student": null
    },
    mYear:()=>{return new Date(Date.now()).toLocaleString('en-US', {month: 'short',year: 'numeric'}).replace(/\s+/g, '-');},
    _set: function(){
        this.sheet = (this.sheet) ? this.sheet : SpreadsheetApp.openById(this.sheet_id);
        this.staff = (this.staff) ? this.staff : this.sheet.getSheetByName('All_Staff').getDataRange().getValues();
        this.students = (this.students) ? this.students : this.sheet.getSheetByName('All_Students').getDataRange().getValues();
        this.schedule.master = (this.schedule.master) ? this.schedule.master : this.sheet.getSheetByName('Schedule').getDataRange().getValues();
        this.schedule.student = (this.schedule.student) ? this.schedule.student : this.sheet.getSheetByName('Student_Schedule').getDataRange().getValues();
    },
    getRowJson: function(t, i) {
        if (t && i) {
            var e = t,
                n = e[0],
                a = [];
            for (var r = {}, g = 0; g < n.length; g++) r[n[g].toLowerCase()] = (String(e[i][g]).replace(/['\-`]/g, ''));
            return r;
        }
    },
    getRowJsonHead: function(t, n) {
        if (t && n) {
            var e = t;
            for (var r = {}, g = 0; g < n.length; g++) r[n[g].toLowerCase()] = (e[g].replace(/['\-`]/g, ''));
            return r;
        }
    },
    getSheetJson: function(t) {
        if (!t) return !1;
        var arr = t.getDataRange().getValues();
        if (!t) throw Error("Sheet not found.");
        for (var e = arr, n = e[0], a = [], l = 1; l < e.length; l++) {
            for (var r = {}, g = 0; g < n.length; g++) r[n[g].toLowerCase()] = (e[l][g].replace(/['\-`]/g, ''))
            a.push(r)
        }
        var s = JSON.stringify(a);
        return a
    },
    getSchedules: function() {
        this._set();
        return this.schedule;
    },
    getStudents: function() {
        this._set();
        return this.students;
    },
    getStudentsAsJSON: function() {
        this._set();
        return this.getSheetJson(this.sheet.getSheetByName('All_Students'));
    },
    getStudentClass: function(e) {
        this._set();
        let t = {};
        if ("studentnumber" in e) {
            let s = ('period' in e)?(e.period=='Acceleration'||e.period=='A')?'INTV':e.period:(getperiod().periodnum=='A')?'INTV':getperiod().periodnum,
                n = this.schedule.master,
                r = this.schedule.student;console.log(s);
            for (var u = new Map, a = 0; a < r.length; a++) {
                var i = r[a];
                i[12] == e.studentnumber && i[13] == s && u.set(i[1], this.getRowJson(r, a))
            }
            if (0 === u.size) return [];
            for (var l = 0; l < n.length; l++) {
                var d = n[l];
                if (d[2] == s) {
                    var f = u.get(d[5]);
                    f && (delete(t = Object.assign(e, {
                        class: {
                            ...f, ...u.get(d[5])
                        }
                    })).class.active, delete t.class.staffnumber)
                }
            }
        }
        return "studentnumber" in t ? t : e
    },

    getStudentDetails: function(t) {
        this._set();
        let e = {};
        if ("studentnumber" in t) {
            let n = this.getStudents();
            for (var s = 0; s < n.length; s++)
                if (n[s][2] == t.studentnumber) {
                    e = Object.assign(t, {
                        student: this.getRowJson(n, s)
                    });
                    break
                }
        }
        return "studentnumber" in e ? e : t
    }


}

//SpreadsheetApp.openById("1HhUzi3vSi3Duk7aIdJKkE97HskNAbEaSAhurj387Iss")
function test() {
    console.log(SI.getStudentClass({
        "studentnumber": 2128662,
        "period": 7
    }));
}
