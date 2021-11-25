//NET

//CLIENT SERVER CONNECTION
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

//SCENE COLLECTION
collection();
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
//SEQUENCE
var mysequence;
sequence("test");
function sequence(name){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    console.log(result);
                    mysequence=result;
                }
        });
        xhr.open("GET", "http://127.0.0.1:8000/sequence?file="+name);
        xhr.send();
}
function savesequence(name,sequence){
    var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                    var result=JSON.parse(this.responseText);
                    console.log(result);
                }
        });
        xhr.open("GET", "http://127.0.0.1:8000/sequence?file="+name);
        xhr.send();
}