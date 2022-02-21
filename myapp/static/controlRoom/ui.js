//Ui js

var opensection="live"; //startup screen
if(screen.width<425) opensection="live";
if(localStorage.getItem("ip")===null) opensection="devices";
document.querySelector("#"+opensection).style.display="flex";
document.querySelector("#"+opensection).style.opacity=1;

section(opensection);

//################ SECTIONS WORK
function section(x){
    let prev=opensection;
    if(x!=prev){
        opensection=x;
        document.querySelector("#"+prev).style.opacity=0;
        document.querySelector("#"+x).style.display="flex";
        setTimeout(() => {
            document.querySelector("#"+x).style.opacity=1;
            document.querySelector("#"+prev).style.display="none";
        }, 500);
    }
    switch (x) {
        case "scenes":
            scenesin("category");
            break;
        case "sequences":
            squencelistupd("sgt2022");
            break;
        case "rundowns":
            rundownlistupd("sgt2022");
            break;
        case "live":
            livelistupd("sgt2022");
            break;
        case "devices":
            getdevices();
            break;
    }
}

//################ TILE WORK
async function tile(x,options){
    document.querySelector("#"+x).parentElement.classList.toggle("open");

    if(document.querySelector("#"+x).parentElement.classList.contains("open")){
    switch (x) {
        case "sceneedit":
            tilescenepreview();
            tilescenegetkey();
            await tilescenegetsequences();
            if(typeof options !== 'undefined') {
                if(options.category){
                    document.querySelector("#tsn_category").value=options.category;
                }
                if(options.key>-1){
                    let value=await scenebykey(options.key);
                    value.key=options.key;
                    datatotilescene(value);
                    tilescenepreview();
                    console.log(value);
                }
            }

        break;
        case "sequenceedit":
            await tilescenegetsequences();
            if(typeof options !== 'undefined') {
                if(options.category){
                    document.querySelector("#tsn_category").value=options.category;
                }
                if(options.key>-1){
                    //let value=await sequencepick(options.key);
                    //value.key=options.key;
                    //datatotilescene(value);
                    //tilescenepreview();
                    //console.log(value);
                } else {
                    document.querySelector("#tsq_key").innerHTML="";
                    document.querySelector("#tsq_name").innerHTML="";
                }
            }

        break;
    }
    }
}
function tilescenetodata(){
    let value = {};
    value.key=document.querySelector("#tsn_key").value;
    value.name=document.querySelector("#tsn_name").value;
    value.category=document.querySelector("#tsn_category").value;
    value.color1=document.querySelector("#tsn_color1").value;
    value.color2=document.querySelector("#tsn_color2").value;
    value.types=[];
    for (var key in _types) {
        if(document.querySelector("#tsn_"+key).classList.contains("checked")){
            value.types.push(key);
        }
    }
    return value;
}
function datatotilescene(value){
    document.querySelector("#tsn_key").value=Number(value.key);
    document.querySelector("#tsn_name").value=value.name;
    document.querySelector("#tsn_category").value=value.category;
    document.querySelector("#tsn_color1").value=value.color1;
    document.querySelector("#tsn_color2").value=value.color2;
    for (var key in _types) { //remove all
        document.querySelector("#tsn_"+key).classList.remove("checked");
    }
    if(value.types){
    value.types.forEach(type => { //than add
        document.querySelector("#tsn_"+type).classList.add("checked");
    });}
}
function tilescenepreview(){ //generates and adds a scene button to the scene editing tile
    document.querySelector("#tilescenepreview").innerHTML="";
    document.querySelector("#tilescenepreview").appendChild(scenebutton("preview",tilescenetodata()))
}
async function tilescenegetkey(){
    let scenes = await scenecollist();

    let newkey=0;

    scenes.forEach(element => {
        if(element[1]>=newkey) newkey=Number(element[1])+1;
    });
    document.querySelector("#tsn_key").value=newkey;
}
async function tilescenegetsequences(){
    let optionsseqdat = await optionssequences("sgt2022");

    //add default
    let def=new Option;
    def.value="_default";
    def.innerHTML="Default";
    optionsseqdat.push(def);

    let seqselector=document.querySelector("#tsn_category");
    seqselector.innerHTML="";
    optionsseqdat.forEach(option => {
        seqselector.appendChild(option.cloneNode(true));
    });
    seqselector.value="_default";
}
function tiletoggletypes(nail){
    nail.classList.toggle("checked");
}
async function tilescenesave(){
    await sceneupd(tilescenetodata());
    tile('sceneedit'),section('scenes');
}
async function tilescenedelete(close){
    let value=tilescenetodata();
    value.delete=true;
    await sceneupd(value);
    if(close) tile('sceneedit');
    section('scenes');
}

//################ SCENE COLLECTION
async function scenesin(method){
    let data = await scenes();

    let container = document.querySelector("#scenecollection");
    container.innerHTML="";

    switch (method) {
        case "all": {

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
            
            }break;
        case "category": {
            let catnames=[];

            for (let [key, value] of Object.entries(data)) {
                if(!catnames.includes(value.category)) catnames.push(value.category);
            }

            catnames.sort();

            let scenespercat={};
            catnames.forEach(name => {
                scenespercat[name]={};
                scenespercat[name].buttons=[];
            });

            for (let [key, value] of Object.entries(data)) {
                scenespercat[value.category].buttons.push(scenebutton(key,value));
            }

            catnames.forEach((name,i) => {
                let category = document.createElement("div");
                category.className="category";

                let holder = document.createElement("div"),
                    p = document.createElement("p");
                holder.className="sceneholder";
                if(!(name.charAt(0)=="_")) p.innerHTML=name;
                category.appendChild(p);

                scenespercat[name].buttons.forEach(button => {
                    holder.appendChild(button);
                });

                //add create button
                let scene = document.createElement("div");
                scene.className="scene create";
                scene.innerHTML="+";
                scene.setAttribute("onclick","tile('sceneedit',{'category':'"+name+"'})");
                holder.appendChild(scene);
                
                //append to category
                category.appendChild(holder);
                container.appendChild(category);
            });

            }break;
    }

};

function scenebutton(key,value){
    let scene = document.createElement("div");
    scene.className="scene";
    scene.innerHTML=value.name;
    if(value.pattern) scene.classList.add(value.pattern);
    let foot = document.createElement("div");
    let p = document.createElement("p");
    if(value.category!="_default") p.innerHTML=value.category;
    foot.appendChild(p);

    if(value.types)
        value.types.forEach(type => {
            let icon = document.createElement("i");
            icon.classList.add("bi");
            icon.classList.add("bi-"+_types[type]);
        
            foot.appendChild(icon);
        });
    
    scene.appendChild(foot);
    scene.style.backgroundImage="linear-gradient(139deg, "+value.color1+" 0%, "+value.color2+" 100%)";
    if(key!="preview"){
        scene.setAttribute("onclick","push("+key+")");
        scene.dataset.id=key;
    }
    return scene;
}
function push(key){
    switch (scenecollectionstate) {
        case "play":
            goscene(key);
            break;
        case "edit":
            tile('sceneedit',{'key':key});
            break;
        case "delete":
            document.querySelector("[data-id='"+key+"']").classList.toggle("todelete");
            break;
    }
}
function collectionstate(x){
    if(scenecollectionstate=="delete"){
        let todelete = document.getElementsByClassName("todelete");
        console.log(todelete);
        for (let element of todelete) {
            console.log(element.dataset.id);
            document.querySelector("#tsn_key").value=element.dataset.id;
            tilescenedelete(false);
        };
    }

    document.querySelector("#state_delete").classList.replace("btn-danger","btn-outline-danger");
    document.querySelector("#state_edit").classList.replace("btn-secondary","btn-outline-secondary");
    document.querySelector("#state_play").classList.replace("btn-secondary","btn-outline-secondary");
    scenecollectionstate=x;
    document.querySelector("#state_"+x).classList.replace("btn-outline-danger","btn-danger");
    document.querySelector("#state_"+x).classList.replace("btn-outline-secondary","btn-secondary");
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
    sequencebykey(optionsseqdat[0].innerHTML); //than starts triggersupd();
}
async function triggersupd(data){
    //triggers
    createtriggers(data.seq);
    current_seqdat=data;
    
    //obs scene selection
    let optionsobsdat = await optionsobs();
    let obsselector=document.querySelector("#obsselect");
    obsselector.innerHTML="";
        optionsobsdat.forEach(option => {
            obsselector.appendChild(option.cloneNode(true));
        });
    if(optionsobsdat.length==1){
        document.querySelector("#obsselect > option").innerHTML=data.meta.obsscene;
    }
    obsselector.value=data.meta.obsscene;

    //video
    if(data.meta.syncedmedia){
        document.querySelector("#videocomp").style.display="block";
        document.querySelector("#vid").src=data.meta.syncedmedia;
        //temp
        document.querySelector("#vid").src="videostream";

    } else {
        document.querySelector("#videocomp").style.display="none";
    }

}
function se_save(){
    current_seqdat.seq=containertodata();
    document.querySelector("#savebtn").classList.replace("btn-warning","btn-secondary");
    current_seqdat.meta.obsscene=document.querySelector("#obsselect").value;
    sequenceupd(current_seqdat);
}
function se_apply(){
    current_seqdat.seq=containertodata();
    document.querySelector("#savebtn").classList.replace("btn-secondary","btn-warning")
}
function containertodata(){
    let sequence={};

    let trigger = document.querySelectorAll("#seqcomposer > div:not(:last-child)");
    trigger.forEach(el => {
        
        let key = el.getElementsByTagName('input')[0].value;
        let val = el.getElementsByTagName('select')[0].value;
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
            startpoint = document.createElement("i"),
            selobs = document.createElement("select"),
            selsce = document.createElement("select"),
            x = document.createElement("p");
        
        trigger.className="trigger";

        startpoint.className="bi bi-caret-right-square";
        startpoint.setAttribute("onclick","setstartpoint(this)");

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

        trigger.appendChild(startpoint);
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

    //container.scrollTop = container.scrollHeight;

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
    let time=0;
    time=document.querySelector("#vid").currentTime*1000;
    if(document.getElementsByClassName("startpoint")[0]){
        time=document.getElementsByClassName("startpoint")[0].nextSibling.value;
    }
    newonclick=true;
    midistop();
    midiplay(current_seqdat.meta.file, time);
    counter=time;
    counterengine = setInterval(() => {
        counter+=100;
    }, 100);
    timeoutpulse(time);
    document.querySelector("#vid").currentTime = time/1000;
}
function se_stop(){
    newonclick=false;
    counter=undefined;
    midistop();
    midiplay("off",0);
    clearInterval(counterengine);
    timeoutpulse_reset();
    document.querySelector("#vid").pause();
}
function se_reset(){
    newonclick=false;
    counter=undefined;
    midistop();
    midiplay("off",0);
    clearInterval(counterengine);
    timeoutpulse_reset();
    document.querySelector("#vid").currentTime = 0;
    document.querySelector("#vid").load();
}

document.querySelector("#vid").onplay = (event) => {
    se_play()
};
document.querySelector("#vid").onpause = (event) => {
    se_stop()
};

//startpoint handling
function setstartpoint(i){
    if(i.classList.contains("startpoint")){
        i.classList.remove("startpoint");
    } else {
        let start=document.getElementsByClassName("startpoint")[0];
        if(start!=undefined) start.classList.remove("startpoint");
        i.classList.add("startpoint");
    }
}
//trigger pulse on done
var pulseinterval=[];
function timeoutpulse(time){
    let trigger = document.querySelectorAll("#seqcomposer > div:not(:last-child)");
    trigger.forEach(el => {
        if(el.getElementsByTagName('input')[0].value-time>=0){
            timeoutpulse_t(el,el.getElementsByTagName('input')[0].value-time);
        }
    });
}
function timeoutpulse_t(el,t){
    let i = setTimeout(() => {
        el.classList.add("pulse");
        el.scrollIntoView();
        document.querySelector("#seqcomposer").scrollTop -= 80;
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

async function tilesequencesave(){
    await rundownupd(tilesequencetodata());
    tile('sequenceedit'),section('sequences');
}
async function tilesequencedelete(close){
    let value=tilesequencetodata();
    value.delete=true;
    await sequenceupd(value);
    if(close) tile('sequenceedit');
    section('sequences');
}

function tilesequencetodata(){
    let value = {};
    value.file=document.querySelector("#tsq_file").value;
    value.name=document.querySelector("#tsq_name").value;
    value.type=document.querySelector("#tsq_type").value;
    return value;
}
function datatotilesequence(value){
    document.querySelector("#tsq_file").value=value.file;
    document.querySelector("#tsq_name").value=value.name;
    document.querySelector("#tsq_type").value=value.type;
}

//################ RUNDOWN COMPOSER
var current_rundat;
async function rundownlistupd(show){
    let optionsrundat = await optionsrundown(show);
    let runselector=document.querySelector("#runselect");
    runselector.innerHTML="";
    optionsrundat.forEach(option => {
        runselector.appendChild(option.cloneNode(true));
    });
    rundownbykey(optionsrundat[0].innerHTML); //than starts runsequenceholderupd();
}
async function runsequenceholderupd(data){
    //sequences
    runcreatesequences(data.list);
    let draggables=document.querySelectorAll('.runsequence');
    let container=document.querySelectorAll('.runcomposer');
    dragengine(draggables,container);
    current_rundat=data;
}
async function run_save(){
    current_rundat.list = await runcontainertodata();
    await rundownupd(current_rundat);
    document.querySelector("#runsavebtn").classList.replace("btn-warning","btn-secondary");
}
function run_apply(){
    current_rundat.list=runcontainertodata();
    document.querySelector("#runsavebtn").classList.replace("btn-secondary","btn-warning")
}
async function runcontainertodata(){
    let rundown=[];

    let sequence = document.querySelectorAll("#runcomposer > div");
    sequence.forEach(el => {
        let key = el.getElementsByTagName('p')[0].innerHTML;
        rundown.push(key);
    });
    return rundown;
}
async function runcreatesequences(seq){
    let container=document.querySelector("#runcomposer");
    container.innerHTML="";

    seq.forEach(seq => {
        let sequence = document.createElement("div"),
            dots = document.createElement("i"),
            name = document.createElement("p"),
            x = document.createElement("p");
        
        sequence.className="runsequence";
        sequence.draggable=true;

        dots.className="bi bi-arrows-expand";

        name.innerHTML=seq;

        x.innerHTML="X";
        x.className="del";
        x.setAttribute("onclick","deletesequence(this)");

        sequence.appendChild(dots);
        sequence.appendChild(name);
        sequence.appendChild(x);

        container.appendChild(sequence);
    });
}
function deletesequence(p){
    p.parentElement.remove();
    current_rundat.list=runcontainertodata();
}
//precomp options fields for select elems
async function optionsrundown(show){
    let list= await rundowncollist(show);
    let options = [];

    list.forEach(element => {
        let option = document.createElement("option");
        option.innerHTML=element;
        option.value=element;
        options.push(option);
    });

    return options;
}

async function tilerundownsave(){
    let data = current_rundat;
    data.name = await tilerundowntodata();
    await rundownupd(data);
    tile('rundownedit'),section('rundowns');
}
async function tilerundowndelete(close){
    let value=tilerundowntodata();
    value.delete=true;
    await rundownupd(value);
    if(close) tile('sequenceedit');
    section('sequences');
}

function tilerundowntodata(){
    let value;
    value=document.querySelector("#tru_name").value;
    return value;
}
function datatotilesequence(value){
    document.querySelector("#tru_name").value=value.name;
    document.querySelector("#tru_show").value=value.show;
}

//drag n drop
function dragengine(el,cont){
    el.forEach(el => {
        el.addEventListener('dragstart', () => {
            el.classList.add('dragging')
        })
      
        el.addEventListener('dragend', () => {
            el.classList.remove('dragging')
        })
      })
      
      cont.forEach(cont => {
        cont.addEventListener('dragover', e => {
          e.preventDefault()
          const afterElement = getDragAfterElement(cont, e.clientY)
          const draggable = document.querySelector('.runsequence')
          if (afterElement == null) {
            cont.appendChild(draggable)
          } else {
            cont.insertBefore(draggable, afterElement)
          }
        })
      })
      function getDragAfterElement(cont, y) {
        const draggableElements = [...cont.querySelectorAll('.runsequence:not(.dragging)')]
      
        return draggableElements.reduce((closest, child) => {
          const box = child.getBoundingClientRect()
          const offset = y - box.top - box.height / 2
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
          } else {
            return closest
          }
        }, { offset: Number.NEGATIVE_INFINITY }).element
      }
}

//################ LIVE
async function livelistupd(show){
    let optionsseqdat = await optionssequences(show);
    let seqselector=document.querySelector("#liveselect");
    seqselector.innerHTML="";
    optionsseqdat.forEach(option => {
        seqselector.appendChild(option.cloneNode(true));
    });
    sequencebykey(optionsseqdat[0].innerHTML);
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

    result.available.inputs.forEach(element => {
        var option = document.createElement("option");
        option.innerHTML=element;
        inlist.appendChild(option);
    });

    result.available.outputs.forEach(element => {
        var option = document.createElement("option");
        option.innerHTML=element;
        outlist.appendChild(option);
    });

    inlist.value=result.current.input;
    outlist.value=result.current.output;
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
    let needobs=["#obsselect"];

    switch (element) {
        case "server":
            needserver.forEach(element => {
                if(bool) {document.querySelector(element).classList.remove("unavailable");}
                else {document.querySelector(element).classList.add("unavailable");}
            });
            if(bool) document.querySelector('meta[name="theme-color"]').setAttribute('content',  '#0f0');
            else document.querySelector('meta[name="theme-color"]').setAttribute('content',  '#f00');
            break;
        v
        case "obs":
            needobs.forEach(element => {
                if(bool){document.querySelector(element).disabled=false;}
                else {document.querySelector(element).disabled=true;}
            });
    }
}

//send cc
function sendccui(){
    let ch = document.querySelector("#channel").value;
    let co = document.querySelector("#controller").value;
    let va = document.querySelector("#value").value;
    sendcc(ch,co,va);
}

/////////const alley
const _types = { "moving": "bezier", "strobo": "lightning-fill", "smoky": "cloud-haze2-fill", "pyro": "stars", "audience": "people-fill" };
var scenecollectionstate = "play";