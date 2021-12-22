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
    return new Promise(resolve => {
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) { try {
                    var result= JSON.parse(this.responseText);
                    if (result.state=="Pong") {resolve(true);} else resolve(false)
                } catch (error) {
                    statusupd("server",false);
                }}
        });
        xhr.open("GET", "http://"+ip+":8000/ping");
        xhr.send();
    }
)};
async function ping(){
   await pingcom()
    statusupd("server",await pingcom());
};
//ping start and repeat
setTimeout(async () => {
    statusupd("server",await pingcom());
}, 1000);
setInterval(async () => {
    statusupd("server",await pingcom());
}, 10000);

//OBS CHECKS
async function pingobs(){
    return new Promise(resolve => {
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) { try {
                    var result= JSON.parse(this.responseText);
                    if (result.state=="Pong") {resolve(true); statusupd("obs", true);} else resolve(false)
                } catch (error) {
                    statusupd("obs",false);
                }}
        });
        xhr.open("GET", "http://"+ip+":8000/pingobs");
        xhr.send();
    }
)};
//ping start and repeat
setTimeout(async () => {
    statusupd("obs",await pingobs());
}, 1000);
setInterval(async () => {
    statusupd("obs",await pingobs());
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