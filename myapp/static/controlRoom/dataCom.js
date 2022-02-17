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
                        statusupd("server",result.server);
                        serveripsave(result.server);
                        statusupd("miin",result.miin);
                        statusupd("miout",result.miout);
                        statusupd("obs",result.obs);
                        resolve(true);
                    }
                } catch (error) {
                    statusupd("server",false);
                    statusupd("miin",false);
                    statusupd("miout",false);
                    statusupd("obs",false);
                    resolve(false);
                }
            }
        });
        xhr.open("GET", "http://"+ip+":8000/ping");
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
    ping();
}, 60000);

//############## CLIENT SERVER CONNECTION

//SCENE SCENES
async function scenes(){
    var xhr = new XMLHttpRequest();
    return new Promise(resolve => {
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    resolve(result);
                }
        });
        xhr.open("GET", "http://"+ip+":8000/scenes");
        xhr.send();
    });
}
async function scenebykey(key){
    var xhr = new XMLHttpRequest();
    return new Promise(resolve => {
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    resolve(result);
                }
        });
        xhr.open("GET", "http://"+ip+":8000/scenebykey?key="+key);
        xhr.send();
    });
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
        xhr.open("GET", "http://"+ip+":8000/scenes");
        xhr.send();
    });
}
async function sceneupd(scene){
    var xhr = new XMLHttpRequest();
    return new Promise(resolve => {
        xhr.addEventListener("readystatechange", function() {
            resolve();
        });
        xhr.open("PUT", "http://"+ip+":8000/scenes");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(scene));
    });
}

//SEQUENCE
function sequencebykey(name){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    //console.log(result);
                    triggersupd(result);
                }
        });
        xhr.open("GET", "http://"+ip+":8000/sequencebykey?key="+name);
        xhr.send();
}
function se_new(){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    //console.log(result);
                    triggersupd(result);
                }
        });
        xhr.open("GET", "http://"+ip+":8000/sequencenew");
        xhr.send();
}
function sequenceupd(sequence){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    console.log(result);
                }
        });
        xhr.open("PUT", "http://"+ip+":8000/sequence?file="+sequence.meta.file);
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
                    list["show"]=result.sequences.show;
                    list["bin"]=result.sequences.bin;
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
