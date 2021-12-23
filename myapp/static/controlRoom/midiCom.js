//MIDI COM

//SERVER MIDI DEVICES CONNECTION
function getdevicelist(){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) { try{
                    var result=JSON.parse(this.responseText);
                    devicestoselect(result);
                } catch (error) {
                    statusupd("server",false);
                }}
        });
        xhr.open("GET", "http://"+ip+":8000/devicelist");
        xhr.send();
}
function getdevices(){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) { try{
                    var result=JSON.parse(this.responseText);
                    statusupd("miin",result.input);
                    statusupd("miout",result.output);
                    serverdevices(result.input,result.output);
                } catch (error) {
                    statusupd("miin",false);
                    statusupd("miout",false);
                }}
        });
        xhr.open("GET", "http://"+ip+":8000/devices");
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
        xhr.open("PUT", "http://"+ip+":8000/devices?in="+indevice+"&out="+outdevice);
        xhr.send();
}

//MIDI SIGNALS TRIGGER
function sendcc(ch,co,va){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    console.log(result);
                }
        });
        xhr.open("POST", "http://"+ip+":8000/sendcc?channel="+ch+"&controller="+co+"&value="+va);
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
        xhr.open("GET", "http://"+ip+":8000/testrecive");
        xhr.send();
}
function goscene(i){
    var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://"+ip+":8000/goscene?index="+i);
        xhr.send();
}

//PLAYER TRIGGER
function midiplay(filename){
    var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://"+ip+":8000/play?file="+filename);
        xhr.send();
}
function midistop(){
    var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://"+ip+":8000/stop");
        xhr.send();
}