//NET
async function pingcom(){
    return new Promise(resolve => {
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result= JSON.parse(this.responseText);
                    //console.log(result);
                    if (result.state=="pong") {resolve(true);} else resolve(false)
                }
        });
        xhr.open("GET", "http://127.0.0.1:8000/ping");
        xhr.send();
    }
)};
function ping(){
    statusupd("server",pingcom());
};
//ping repeat
setInterval(() => {
    statusupd("server",pingcom());
}, 60000);