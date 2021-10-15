//Midi communication
function devices(){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    console.log(result);

                    result.inputs.forEach(element => {
                        var option = document.createElement("option");
                        option.innerHTML=element;
                        document.querySelector("#inputGroupSelect01").appendChild(option);
                    });

                    result.outputs.forEach(element => {
                        var option = document.createElement("option");
                        option.innerHTML=element;
                        document.querySelector("#inputGroupSelect02").appendChild(option);
                    });
                }
        });
        xhr.open("GET", "http://127.0.0.1:8000/testdevices");
        xhr.send();
}
function setdevices(){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    console.log(result);

                    document.querySelector("#inputGroupSelect01").innerHTML="";
                    document.querySelector("#inputGroupSelect02").innerHTML="";

                    result.inputs.forEach(element => {
                        var option = document.createElement("option");
                        option.innerHTML=element;
                        document.querySelector("#inputGroupSelect01").appendChild(option);
                    });

                    result.outputs.forEach(element => {
                        var option = document.createElement("option");
                        option.innerHTML=element;
                        document.querySelector("#inputGroupSelect02").appendChild(option);
                    });
                }
        });
        xhr.open("POST", "http://127.0.0.1:8000/testsetdevices");
        xhr.send();
}
function sendmidi(){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    console.log(result);
                }
        });
        xhr.open("GET", "http://127.0.0.1:8000/testsend");
        xhr.send();
}
function recivemidi(){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    console.log(result);
                }
        });
        xhr.open("GET", "http://127.0.0.1:8000/testrecive");
        xhr.send();
}