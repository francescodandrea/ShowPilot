//MIDI COM
function getdevices(){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    console.log(result);
                    devicestoselect(result);
                }
        });
        xhr.open("GET", "http://127.0.0.1:8000/devices");
        xhr.send();
}
function senddevices(indevice,outdevice){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    console.log(result);
                }
        });
        xhr.open("PUT", "http://127.0.0.1:8000/setdevices?in="+indevice+"&out="+outdevice);
        xhr.send();
}
function sendcc(ch,co,va){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    console.log(result);
                }
        });
        xhr.open("POST", "http://127.0.0.1:8000/sendcc?channel="+ch+"&controller="+co+"&value="+va);
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