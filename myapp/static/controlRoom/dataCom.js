//NET
let ip="localhost";
if(localStorage.getItem("ip")) {
    ip=localStorage.getItem("ip");
    document.querySelector("#serverip").innerHTML=ip;
};
function serveripsave(ip){
    localStorage.setItem("ip",ip);
}

//SERVER CHECKS
async function pingcom(){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) { try {
                    var result= JSON.parse(this.responseText);
                    if (result.state=="Pong") {
                        statusupd("server",result.server);
                        statusupd("miin",result.miin);
                        statusupd("miout",result.miout);
                        statusupd("obs",result.obs);
                    }
                } catch (error) {
                    statusupd("server",false);
                    statusupd("miin",false);
                    statusupd("miout",false);
                    statusupd("obs",false);
                }}
        });
        xhr.open("GET", "http://"+ip+":8000/ping");
        xhr.send();
};

function ping(){
   pingcom();
};

//ping start and repeat
setTimeout(async () => {
    ping();
}, 1000);
setInterval(async () => {
    ping();
}, 10000);

//############## CLIENT SERVER CONNECTION

//SCENE COLLECTION
function collection(){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    collectionin(result);
                    //console.log(result);
                }
        });
        xhr.open("GET", "http://"+ip+":8000/collection");
        xhr.send();
}
async function scenecollist(){
    var xhr = new XMLHttpRequest();
    return new Promise(resolve => {
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    let list=[];
                    for (var key in result) {
                        let value = result[key].name;
                        list.push([value,key]);
                    }
                    resolve(list);
                }
        });
        xhr.open("GET", "http://"+ip+":8000/collection");
        xhr.send();
    });
}

//SEQUENCE
function sequence(name){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    //console.log(result);
                    triggersupd(result);
                }
        });
        xhr.open("GET", "http://"+ip+":8000/sequence?file="+name);
        xhr.send();
}
function sequenceeditupd(file,sequence){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.respoSnseText);
                    console.log(result);
                }
        });
        xhr.open("PUT", "http://"+ip+":8000/sequence?file="+file);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(sequence));
}
async function sequencecollist(show){
    var xhr = new XMLHttpRequest();
    return new Promise(resolve => {
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    let list=[];
                    list.show=result.sequences.show;
                    list.bin=result.sequences.bin;
                    resolve(list);
                }
        });
        xhr.open("GET", "http://"+ip+":8000/show?file="+show);
        xhr.send();
    });
}

//SHOW
function show(name){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    console.log(result);
                    triggersupd(result);
                }
        });
        xhr.open("GET", "http://"+ip+":8000/show?file="+name);
        xhr.send();
}
function showeditupd(file,show){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.respoSnseText);
                    console.log(result);
                }
        });
        xhr.open("PUT", "http://"+ip+":8000/show?file="+file);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(show));
}


//OBS SCENELIST
async function obsscenelist(){
    return new Promise(resolve => {
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result= JSON.parse(this.responseText);
                    //console.log(result.obsscenelist);
                    resolve(result.obsscenelist);
                }
        });
        xhr.open("GET", "http://"+ip+":8000/obsscenelist");
        xhr.send();
    }
)};

//OBS DIRECT
async function obsscenelist(){
    return new Promise(resolve => {
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result= JSON.parse(this.responseText);
                    //console.log(result.obsscenelist);
                    resolve(result.obsscenelist);
                }
        });
        xhr.open("GET", "http://"+ip+":8000/obsscenelist");
        xhr.send();
    }
)};