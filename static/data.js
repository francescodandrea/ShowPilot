//NET
let ip="localhost";
if(localStorage.getItem("ip")) {
    ip=localStorage.getItem("ip");
    document.querySelector("#serverip").value=ip;
};
function serveripsave(i){
    localStorage.setItem("ip",i);
    ip=i;
}

//SERVER CHECKS
async function pingcom(){
    return new Promise(resolve => {
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) { try {
                    var result= JSON.parse(this.responseText);
                    if (result.state=="Pong") {
                        lineupd(result.currentl)
                        currentl=result.currentl;
                        resolve(true);
                    }
                } catch (error) {
                    resolve(false);
                }
            }
        });
        xhr.open("GET", "/ping");
        xhr.send();
    });
}

async function ping(){
   return await pingcom();
};

//ping start and repeat
setTimeout(async () => {
    if(await ping()){
        localStorage.setItem("ip",ip);
        document.querySelector("#serverip").value=ip;
    }
}, 1000);
setInterval(() => {
    statusupd("server",ping())
}, 3000);

//############## CLIENT SERVER CONNECTION

//LINES
var liness=[];
var currentl=0;
lines();

async function lines(){
    var xhr = new XMLHttpRequest();
    return new Promise(resolve => {
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    liness=result;
                    resolve(result);
                }
        });
        xhr.open("GET", "/lines");
        xhr.send();
    });
}

async function current(line){
    var xhr = new XMLHttpRequest();
    return new Promise(resolve => {
        xhr.addEventListener("readystatechange", function() {
            resolve();
        });
        xhr.open("PUT", "/current?l="+line);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    });
}
