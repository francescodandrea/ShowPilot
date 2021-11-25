//Ui js
var opensection="scenes"; //startup screen
document.querySelector("#"+opensection).style.display="inherit";
document.querySelector("#"+opensection).style.opacity=1;

//################ SECTIONS WORK
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

//################ SCENE COLLECTION
function collectionin(data){
    
    let container = document.querySelector("#scenecollection");
    container.innerHTML="";

    let category = document.createElement("div");
    category.className="category";

    let holder = document.createElement("div"),
        p = document.createElement("p");
    holder.className="sceneholder";
    p.innerHTML="Tutte le scene";
    container.appendChild(p);

    for (let [key, value] of Object.entries(data)) {
        if(value.name){//if scene isnt hidden
            let scene = document.createElement("div");
            scene.className="scene";
            scene.innerHTML=value.name;
            if(value.pattern) scene.classList.add(value.pattern);
            if(value.types)
                value.types.forEach(type => {
                    scene.classList.add(type);
                });
            scene.setAttribute("onclick","goscene("+key+")");
            holder.appendChild(scene);
        }
    };

    //add create button
    let scene = document.createElement("div");
    scene.className="scene create";
    scene.innerHTML="+";
    scene.setAttribute("onclick","linkscene()");
    holder.appendChild(scene);

    //append to container
    container.appendChild(holder);

}


//################ DEVICES
//devices upd
//----set
function devicestoselect(result){
    //set
    let inlist = document.querySelector("#inputGroupSelect01");
    let outlist = document.querySelector("#inputGroupSelect02");

    //setup
    inlist.innerHTML="";
    outlist.innerHTML="";

    result.inputs.forEach(element => {
        var option = document.createElement("option");
        option.innerHTML=element;
        inlist.appendChild(option);
    });

    result.outputs.forEach(element => {
        var option = document.createElement("option");
        option.innerHTML=element;
        outlist.appendChild(option);
    });
}
function setdevices(){
    let inp = document.querySelector("#inputGroupSelect01");
    let out = document.querySelector("#inputGroupSelect02");
    let inptxt; let outtxt;
    try {
        inptxt = inp.options[inp.selectedIndex].text;
    } catch (error) {
        if(inptxt==undefined){inptxt="undefined";}
    }
    try {
        outtxt = out.options[out.selectedIndex].text;
    } catch (error) {
        if(outtxt==undefined){outtxt="undefined";}
    }
    
    senddevices(inptxt, outtxt);
}
function serverdevices(sinp,sout){
    let inp = document.querySelector("#inputGroupSelect01");
    let out = document.querySelector("#inputGroupSelect02");
    
    inp.value=sinp;
    out.value=sout;
}
//----devices status
function statusupd(element, bool){
    let arg = document.querySelector("#status_"+element);
        arg.className="status";
    setTimeout(() => {
        if(bool){
            arg.className="status ok";
        } else {
            arg.className="status no";
        }
    }, 200);
}

//send cc
function sendccui(){
    let ch = document.querySelector("#channel").value;
    let co = document.querySelector("#controller").value;
    let va = document.querySelector("#value").value;
    sendcc(ch,co,va);
}