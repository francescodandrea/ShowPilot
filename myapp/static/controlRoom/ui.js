//Ui js
var opensection="scenes";
document.querySelector("#"+opensection).style.display="inherit";
document.querySelector("#"+opensection).style.opacity=1;

//section work
function section(x){
    let prev=opensection;
    if(x!=prev){
        opensection=x;
        document.querySelector("#"+prev).style.opacity=0;
        document.querySelector("#"+x).style.display="inherit";
        setTimeout(() => {
            document.querySelector("#"+x).style.opacity=1;
            document.querySelector("#"+prev).style.display="none";
        }, 500);
    }
}