//Midi communication
function sendmidi(){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                }
        });
        xhr.open("GET", "");
        xhr.send();
}