function loadStorage() {
    let e = localStorage.getItem("global");
    return e ? JSON.parse(e) : []
}

function saveStorage() {
    localStorage.setItem("global", JSON.stringify(global))
}

function clearStorage() {
    return localStorage.setItem("global", null), debug && console.log("localStorage Cleared"), !0
}
function testit(){
  console.log(responsesNames("08-01-2024"))
}
function responsesNames2(e) {
    let t = new Date,
        n = new Date(e),
        o = [];
    while (n <= t) {
        let s = `${n.toLocaleString("default", { month: "short" })}-${n.getFullYear()} Responses`;
        o.push(s);
        n.setMonth(n.getMonth() + 1);
    }
    return o
}
function responsesNames(e="2024-08-01") {
						let t = new Date,
								n = new Date(e),
								o = [];t.setDate(1);
						while (n <= t) {
								let s = `${n.toLocaleString("default", { month: "short" })}-${n.getFullYear()} Responses`;
								o.push(s);
								n.setMonth(n.getMonth() + 1);
						}
						return o
				}
