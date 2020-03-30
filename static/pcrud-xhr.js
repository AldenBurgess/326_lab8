const url = "https://enigmatic-escarpment-01843.herokuapp.com";

function counterCreate() {
    (async () => {
        let counterName = document.getElementById("countername").value;
        const newURL = url + "/create?name=" + counterName;  // this code will change
        const resp = await fetch(newURL);
        const j = await resp.json();
        if (j['result'] !== 'error') {
            document.getElementById("output").innerHTML = "101: <b>" + counterName + " created with value " + j['value'] + "</b>";  // this code will change
        } else {
            document.getElementById("output").innerHTML = "100: " + counterName + " not found.</b>";
        }
    })();
}

function counterRead() {
    (async () => {
        let counterName = document.getElementById("countername").value;
        const newURL = url + "/read?name=" + counterName;  
        const resp = await fetch(newURL);
        const j = await resp.json();
        if (j['result'] !== 'error') {
            document.getElementById("output").innerHTML = "201: <b>" + counterName + " has value " + j['value'] + "</b>";  
        } else {
            document.getElementById("output").innerHTML = "200: " + counterName + " not found.</b>";
        }
    })();
}

function counterUpdate() {
    (async () => {
        let counterName = document.getElementById("countername").value;
        const newURL = url + "/update?name=" + counterName;
        const resp = await fetch(newURL);
        const j = await resp.json();
        if (j['result'] !== 'error') {
            document.getElementById("output").innerHTML = "301: <b>" + counterName + " updated to have value " + j['value'] + "</b>";  
        } else {
            document.getElementById("output").innerHTML = "300: " + counterName + " not found.</b>";
        }
    })();
}

function counterDelete() {
    (async () => {
        let counterName = document.getElementById("countername").value;
        const newURL = url + "/delete?name=" + counterName;  
        const resp = await fetch(newURL);
        const j = await resp.json();
        if (j['result'] !== 'error') {
            document.getElementById("output").innerHTML = "401: <b>" + counterName + " deleted successfully!" + "</b>";  
        } else {
            document.getElementById("output").innerHTML = "400: " + counterName + " not found.</b>";
        }
    })();
}
