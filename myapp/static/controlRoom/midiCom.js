//MIDI COM

//SERVER MIDI DEVICES CONNECTION
function getdevicelist(){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    console.log(result);
                    devicestoselect(result);
                }
        });
        xhr.open("GET", "http://127.0.0.1:8000/devicelist");
        xhr.send();
}
function getdevices(){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    //console.log(result);
                    statusupd("miin",result.input);
                    statusupd("miout",result.output);
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
                    getdevices();
                }
        });
        xhr.open("PUT", "http://127.0.0.1:8000/setdevices?in="+indevice+"&out="+outdevice);
        xhr.send();
}
//ping start and repeat
setTimeout(() => {
    getdevices();
}, 1000);
setInterval(() => {
    getdevices();
}, 10000);

//MIDI SIGNALS TRIGGER
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