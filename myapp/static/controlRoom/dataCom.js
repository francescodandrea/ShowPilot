//NET

//SERVER CHECKS
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
//ping start and repeat
setTimeout(() => {
    statusupd("server",pingcom());
}, 1000);
setInterval(() => {
    statusupd("server",pingcom());
}, 10000);

//OBS CHECKS
async function pingobs(){
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
//ping start and repeat
setTimeout(() => {
    statusupd("obs",pingobs());
}, 1000);
setInterval(() => {
    statusupd("obs",pingobs());
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
        xhr.open("GET", "http://127.0.0.1:8000/collection");
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
        xhr.open("GET", "http://127.0.0.1:8000/collection");
        xhr.send();
    });
}

//SEQUENCE
function sequence(name){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    console.log(result);
                    triggersupd(result);
                }
        });
        xhr.open("GET", "http://127.0.0.1:8000/sequence?file="+name);
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
        xhr.open("PUT", "http://127.0.0.1:8000/sequence?file="+file);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(sequence));
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
        xhr.open("GET", "http://127.0.0.1:8000/obsscenelist");
        xhr.send();
    }
)};