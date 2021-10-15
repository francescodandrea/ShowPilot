//Midi communication
function sendmidi(){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
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
                }
        });
        xhr.open("GET", "http://127.0.0.1:8000/testrecive");
        xhr.send();
}