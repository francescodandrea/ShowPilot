//Ui js

var opensection="scenes"; //startup screen
if(localStorage.getItem("ip")===null) opensection="devices";
document.querySelector("#"+opensection).style.display="inherit";
document.querySelector("#"+opensection).style.opacity=1;

section(opensection);

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
    switch (x) {
        case "scenes":
            collection();
            break;
        case "sequences":
            squencelistupd("sgt2022");
            break;
        case "live":
            livelistupd("sgt2022");
            break;
    }
}

//################ TILE WORK
function tile(x){
    document.querySelector("#"+x).parentElement.classList.toggle("open");
    
    switch (x) {
        case "sceneedit":
            tilescenepreview();
            tilescenegetkey();
            break;
    }
}
function tilescenepreview(){
    document.querySelector("#tilescenepreview").innerHTML="";
    let value = {};
    value.name=document.querySelector("#tsn_name").value;
    value.color1=document.querySelector("#tsn_color1").value;
    value.color2=document.querySelector("#tsn_color2").value;

    document.querySelector("#tilescenepreview").appendChild(scenebutton("preview",value))
}
async function tilescenegetkey(){
    let scenes = await scenecollist();

    let newkey=0;

    scenes.forEach(element => {
        if(element[1]>=newkey) newkey=Number(element[1])+1;
    });
    document.querySelector("#tsn_key").value=newkey;
}

async function tilescenesave(){
    let value = {};
    value.key=document.querySelector("#tsn_key").value;
    value.name=document.querySelector("#tsn_name").value;
    value.color1=document.querySelector("#tsn_color1").value;
    value.color2=document.querySelector("#tsn_color2").value;
    await sceneupd(value);
    tile('sceneedit'),section('scenes');
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
        holder.appendChild(scenebutton(key,value));
    }

    //add create button
    let scene = document.createElement("div");
    scene.className="scene create";
    scene.innerHTML="+";
    scene.setAttribute("onclick","tile('sceneedit')");
    holder.appendChild(scene);

    //append to container
    container.appendChild(holder);
};

function scenebutton(key,value){
    let scene = document.createElement("div");
    scene.className="scene";
    scene.innerHTML=value.name;
    if(value.pattern) scene.classList.add(value.pattern);
    if(value.types)
        value.types.forEach(type => {
            scene.classList.add(type);
        });
    scene.style.backgroundImage="linear-gradient(139deg, "+value.color1+" 0%, "+value.color2+" 100%)";
    if(key!="preview"){
        scene.setAttribute("onclick","goscene("+key+")");
        scene.dataset.id=key;
    }
    return scene;
}

//################ SEQUENCE EDITOR
var current_seqdat;
async function squencelistupd(show){
    let optionsseqdat = await optionssequences(show);
    let seqselector=document.querySelector("#seqselect");
    seqselector.innerHTML="";
    optionsseqdat.forEach(option => {
        seqselector.appendChild(option.cloneNode(true));
    });
    sequence(optionsseqdat[0].innerHTML);
}
async function triggersupd(data){
    createtriggers(data.seq);
    current_seqdat=data;
    
    let optionsobsdat = await optionsobs();
    let obsselector=document.querySelector("#obsselect");
    obsselector.innerHTML="";
    optionsobsdat.forEach(option => {
        obsselector.appendChild(option.cloneNode(true));
    });
    obsselector.value=data.meta.obsscene;
}
function se_save(){
    current_seqdat.seq=containertodata();
    document.querySelector("#savebtn").classList.replace("btn-warning","btn-secondary");
    current_seqdat.meta.obsscene=document.querySelector("#obsselect").value;
    sequenceeditupd(current_seqdat.meta.file,current_seqdat);
}
function se_apply(){
    current_seqdat.seq=containertodata();
    document.querySelector("#savebtn").classList.replace("btn-secondary","btn-warning")
}
function containertodata(){
    let sequence={};

    let trigger = document.querySelectorAll("#seqcomposer > div:not(:last-child)");
    trigger.forEach(el => {
        
        let key = el.childNodes[0].value;
        let val = el.childNodes[1].value;
        sequence[key]=val;
    });
    return sequence;
}
async function createtriggers(seq){
    let container=document.querySelector("#seqcomposer");
    container.innerHTML="";

    //let optionsobsdat = await optionsobs();
    let optionsscenesdat = await optionsscenes();

    for (var key in seq) {
        let trigger = document.createElement("div"),
            input = document.createElement("input"),
            selobs = document.createElement("select"),
            selsce = document.createElement("select"),
            x = document.createElement("p");
        
        trigger.className="trigger";

        input.type="number";
        input.min=0; input.max=600000;
        input.value=key;
        input.setAttribute("onchange","se_apply()");


        /*optionsobsdat.forEach(option => {
            selobs.appendChild(option.cloneNode(true));
        });*/

        optionsscenesdat.forEach(option => {
            selsce.appendChild(option.cloneNode(true));
        });
        selsce.value=seq[key];
        selsce.setAttribute("onchange","se_apply()");

        x.innerHTML="X";
        x.setAttribute("onclick","deletetrigger(this)");

        trigger.appendChild(input);
        //trigger.appendChild(selobs);
        trigger.appendChild(selsce);
        trigger.appendChild(x);

        container.appendChild(trigger);
    }
    let trigger = document.createElement("div");
        trigger.className="trigger create";
        trigger.innerHTML="+";
        trigger.setAttribute("onclick","newtrigger()");
    container.appendChild(trigger);

    container.scrollTop = container.scrollHeight;

}
function newtrigger(){
    let edited = current_seqdat;
    let i=0;
    if(counter!=undefined){
        i=counter;
    } else {
        for (var key in edited.seq) {
            if(Number(key)>Number(i)) i=key;
        }
        i++;
    }
    edited.seq[i] = null;
    triggersupd(edited);
    current_seqdat=edited;
}
function deletetrigger(p){
    p.parentElement.remove();
    current_seqdat.seq=containertodata();
}
//precomp options fields for select elems
async function optionsobs(){
    let list= await obsscenelist();
    let options = [];
    
    let option = document.createElement("option");
    option.value=null
    option.innerHTML=null;
    options.push(option);

    list.forEach(element => {
        let option = document.createElement("option");
        option.innerHTML=element;
        options.push(option);
    });

    return options;
}
async function optionsscenes(){
    let list= await scenecollist();
    let options = [];
    
    let option = document.createElement("option");
    option.value=null
    option.innerHTML=null;
    options.push(option);

    list.forEach(element => {
        let option = document.createElement("option");
        option.innerHTML=element[0];
        option.value=element[1];
        options.push(option);
    });

    return options;
}
async function optionssequences(show){
    let list= await sequencecollist(show);
    let options = [];

    list.show.forEach(element => {
        let option = document.createElement("option");
        option.innerHTML=element;
        option.value=element;
        options.push(option);
    });
    list.bin.forEach(element => {
        let option = document.createElement("option");
        option.innerHTML=element;
        option.value=element;
        options.push(option);
    });

    return options;
}

var newonclick=false;
var counter=undefined;
var counterengine;
//keylistener
const handleKeyboard = event => {
if (newonclick && event.key==='n' || event.key==='N') newtrigger()
}  
document.addEventListener('keyup', handleKeyboard)

//player
function se_play(){
    newonclick=true;
    midistop();
    midiplay(current_seqdat.meta.file);
    counter=0;
    counterengine = setInterval(() => {
        counter+=100;
    }, 100);
    timeoutpulse();
}
function se_stop(){
    newonclick=false;
    counter=undefined;
    midistop();
    clearInterval(counterengine);
    timeoutpulse_reset();
}
function se_reset(){
    newonclick=false;
    counter=undefined;
    midistop();
    midiplay("off");
    clearInterval(counterengine);
    timeoutpulse_reset();
}

//trigger pulse on done
var pulseinterval=[];
function timeoutpulse(){
    let trigger = document.querySelectorAll("#seqcomposer > div:not(:last-child)");
    trigger.forEach(el => {
        timeoutpulse_t(el,el.childNodes[0].value);
    });
}
function timeoutpulse_t(el,t){
    let i = setTimeout(() => {
        el.classList.add("pulse");
    }, t);
    pulseinterval.push(i);
}
function timeoutpulse_reset(){
    pulseinterval.forEach(clearInterval);
    let trigger = document.querySelectorAll("#seqcomposer > div:not(:last-child)");
    trigger.forEach(el => {
        el.className="trigger";
    });
}
//################ LIVE
async function livelistupd(show){
    let optionsseqdat = await optionssequences(show);
    let seqselector=document.querySelector("#liveselect");
    seqselector.innerHTML="";
    optionsseqdat.forEach(option => {
        seqselector.appendChild(option.cloneNode(true));
    });
    sequence(optionsseqdat[0].innerHTML);
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

    let needserver=["#scenes","#sequences","#live"];

    switch (element) {
        case "server":
            needserver.forEach(element => {
                if(!bool) {document.querySelector(element).classList.add("unavailable");}
                else {document.querySelector(element).classList.remove("unavailable");}
            });
            if(bool) document.querySelector('meta[name="theme-color"]').setAttribute('content',  '#0f0');
            else document.querySelector('meta[name="theme-color"]').setAttribute('content',  '#f00');
            break;
    }
}

//send cc
function sendccui(){
    let ch = document.querySelector("#channel").value;
    let co = document.querySelector("#controller").value;
    let va = document.querySelector("#value").value;
    sendcc(ch,co,va);
}