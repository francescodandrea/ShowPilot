const express = require('express'); //express
const app = express();
app.use(express.json());
var expsession = require('express-session');// express sessions
var path = require('path'); //path express
var easymidi = require('easymidi'); //midi com
const OBSWebSocket = require('obs-websocket-js'); //obs
const obs = new OBSWebSocket();
const fetch = require('node-fetch'); //HTTP Requests
const cors = require('cors'); //cors made east
var os = require('os'); // ip getter
const fs = require("fs"); //file reading

var obsip = "192.168.1.37";

var port = 8000;
const ip = true;
//ip = os.networkInterfaces()['Wi-Fi'][1].address;

app.use(
  cors({
    origin: "*",
  })
)
app.use('/static', express.static('public'));

//SERVER STARTUP

var myinput=false;
var myoutput=false;

startupconfigs();

var session = sessioncongifs();

obs.connect({ address: obsip}).catch(err => {console.log("OBS not connected. Testing " + obsip)});

//SETTINGS --------------
//setup communication
app.get('/ping', async (req, res) => {
  //console.log(`Pong`);
  let obsping=true;
  obs.connect({ address: obsip}).catch(err => {obsping=false})
  .then(a =>{
    res.json({ state:'Pong', server:ip, "miin": myinput.name, "miout": myoutput.name, "obs": obsping});
  });
});
app.get('/devices', (req, res) => {
  console.log(`Getting devices`);
  let inputs = easymidi.getInputs();
  let outputs = easymidi.getOutputs();
  res.json({ "available":{ "inputs": inputs, "outputs": outputs }, "current":{ "input": myinput.name, "output": myoutput.name }});
});
app.put('/devices', (req, res) => {
  if(req.query.in!="undefined")
    myinput = new easymidi.Input(req.query.in);
  if(req.query.out!="undefined")
    myoutput = new easymidi.Output(req.query.out);

  console.log('Devices set:'+ req.query.in+", "+req.query.out);
  res.json({ "log": "Devices set on server", "com": {"in": req.query.in, "out": req.query.out} });
  savedevices();
});
async function savedevices(){
  var configs = await config();
  configs.midi.input=myinput.name;
  configs.midi.output=myoutput.name;
  configsave(configs);
}

//------------STORAGE --------------
//**************** scenes ****************
app.get('/scenes', async (req, res) => {
  res.send(await scenes())
  //console.log("sent scenes");
});
async function scenes(){
  return new Promise(resolve => {
  fs.readFile("storage/shows/sgt2022/scenes/scenes.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      let obj = JSON.parse(jsonString);
      resolve(obj);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
  });
}
app.get('/scenebykey', async (req, res) => {
  res.send(await scenebykey(req.query.key))
  //console.log("sent scene selected by key");
});
async function scenebykey(key){
  return new Promise(resolve => {
  fs.readFile("storage/shows/sgt2022/scenes/scenes.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      let obj = JSON.parse(jsonString);
      resolve(obj[key]);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
  });
}
app.put('/scenes', async (req, res) => {
  await scenessave(req.body)
  res.send("done");
});
async function scenessave(scene){
  let collect = await scenes();
  if(!scene.delete){
    collect[scene.key]={};
    collect[scene.key]["name"]=scene.name;
    collect[scene.key]["category"]=scene.category;
    collect[scene.key]["color1"]=scene.color1;
    collect[scene.key]["color2"]=scene.color2;
    collect[scene.key]["types"]=scene.types;
    const jsonString = JSON.stringify(collect);
    fs.writeFile("storage/shows/sgt2022/scenes/scenes.json", jsonString, err => {
      if (err) {
          console.log('Error writing file', err)
      } else {
          console.log('Scene saved')
      }
    })
  } else {
    let bin = await scenebin();
    bin[scene.key]=collect[scene.key];
    delete collect[scene.key];
    const jsonString = JSON.stringify(collect);
    fs.writeFile("storage/shows/sgt2022/scenes/scenes.json", jsonString, err => {
      if (err) {
          console.log('Error writing file', err)
      } else {
          console.log('Scene moved to bin')
      }
    })
    const jsonStringBin = JSON.stringify(bin);
    fs.writeFile("storage/shows/sgt2022/scenes/bin.json", jsonStringBin, err => {
      if (err) {
          console.log('Error writing file', err)
      } else {
          console.log('Scene deleted')
      }
    })
  }
  
}

//**************** sequences ****************
app.get('/sequencebykey', async (req, res) => {
  res.send(await sequencebykey(req.query.key));
  console.log("sent sequence by key");
});
async function sequencebykey(name){
  return new Promise(resolve => {
  fs.readFile("storage/shows/sgt2022/sequences/"+name+".json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      let obj = JSON.parse(jsonString);
      resolve(obj);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
  });
}
app.put('/sequence', (req, res) => {
  sequencesave(req.body);
  res.send("Sequence saved");
});
function sequencesave(data){
  const jsonString = JSON.stringify(data);
  fs.writeFile("storage/shows/sgt2022/sequences/"+data.meta.file+".json", jsonString, async err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('sequence '+data.meta.name+' saved');
    }
})
}

//**************** rundowns ****************
app.get('/rundownbykey', async (req, res) => {
  res.send(await rundownbykey(req.query.key));
  console.log("sent rundown by key");
});
async function rundownbykey(name){
  return new Promise(resolve => {
  fs.readFile("storage/shows/sgt2022/sgt2022.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      let obj = JSON.parse(jsonString);
      let resp={};
      resp.list=obj.rundowns[name];
      resp.name=name;
      resp.show="sgt2022";
      resolve(resp);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
  });
}
app.put('/rundown', (req, res) => {
  rundownsave(req.body);
});
async function rundownsave(data){
  let showw=await show("sgt2022");
  showw.rundowns[data.name]=data.list;
  showsave(showw);
}
app.get('/rundowns', async (req, res) => {
  res.send(await rundowns(req.query.file));
  console.log("sent rundown list");
});
async function rundowns(name){
  return new Promise(resolve => {
  fs.readFile("storage/shows/sgt2022/sgt2022.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      let obj = JSON.parse(jsonString);
      let list=[];
      for (var key in obj.rundowns) {
        list.push(key);
      }
      resolve(list);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
  });
}

//**************** show ****************
app.get('/show', async (req, res) => {
  res.send(await show(req.query.file));
  console.log("sent show");
});
async function show(name){
  return new Promise(resolve => {
  fs.readFile("storage/shows/"+name+"/"+name+".json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      let obj = JSON.parse(jsonString);
      resolve(obj);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
  });
}
app.put('/show', (req, res) => {
  showsave(req.body);
});
function showsave(data){
  const jsonString = JSON.stringify(data);
  fs.writeFile("storage/shows/"+data.meta.file+"/"+data.meta.file+".json", jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('show '+data.meta.name+' saved');
    }
})
}



//------------ MIDI SIGNALS --------------

//TO MIDI
app.post('/goscene', (req, res) => {
  try {
    myoutput.send('cc', {
      channel: Math.floor(req.query.index/128),
      controller: req.query.index % 128,
      value: 0
    });
  } catch (error) {
    console.log("MIDI triggering failed:");
  }

  console.log("midi "+req.query.index+" ("+Math.floor(req.query.index/128)+" "+req.query.index % 128+")")
  res.send();
});
app.post('/play', async (req, res) => {

  let data=await sequencebykey(req.query.file);
  let seq=data.seq;

  if(!req.query.resume){
    obsscenetrigger(data.meta.obsscene);
    for (var key in seq){
          if(seq[key]!="null") miditrigger(seq[key],key);
    }
  } else {
    /* waiting for obs websocket 5.0 release
    */
    /*setmediatime("stay",req.query.resume);
    obsscenetrigger(data.meta.obsscene);*/
    for (var key in seq){
      if(key>=req.query.resume){
          if(seq[key]!="null") miditrigger(seq[key],key-req.query.resume);
      }
    }
  }
  console.log("Currently playing "+data.meta.name);
  res.send();
});

app.post('/stop', async (req, res) => {
  intervals.forEach(clearInterval);
  console.log("Stopped all intervals");
  res.send();
});
//FROM MIDI


//testing only
app.get('/testdevices', (req, res) => {
  console.log(`Getting devices`);
  var inputs = easymidi.getInputs();
  var outputs = easymidi.getOutputs();
  res.json({ "inputs": inputs, "outputs": outputs });
});
app.post('/sendcc', (req, res) => {
  console.log(req.query.channel+" "+req.query.controller+" "+req.query.value)
  
  myoutput.send('cc', {
    channel: parseInt(req.query.channel),
    controller: parseInt(req.query.controller),
    value: parseInt(req.query.value)
  });

  res.json({ "log": "CC sent "+req.query.channel+' '+req.query.controller+' '+req.query.value, "com": {"in": req.query.in, "out": req.query.out} });
});
app.get('/videostream', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'storage/vidignored/rehearsal.mp4'));
  } catch (error) {
    res.json({ "error": error });
  }
});
//TO OBS
app.get('/obsscenelist', (req, res) => {
  //console.log(`Getting obs scenes`);
  let scenelist=[];
  obs.send('GetSceneList').then(data => {
    data.scenes.forEach(scene => {
      scenelist.push(scene.name);
    });
    res.json({ "obsscenelist": scenelist });
  })
  .catch(err => {
    //console.log("Obs isn't active");
    res.json({ "obsscenelist": [] });
  });

});

function obsscenetrigger(name){
  obs.send('SetCurrentScene', {
        'scene-name': name
  })
  .catch(err => {
    console.log('Cannot play OBS scene because '+err.description);
  });
}

function getscenemain(name){
  obs.send('GetSceneItemList', {
        'scene-name': name
  }).then(data => {
    console.log(data);
  })
  .catch(err => {
    console.log(err);
  });
}

function setmediatime(name,timestamp){
  obs.send('SetMediaTime', {
        'sourceName': name,
        'timestamp': timestamp
  }).then(data => {
    console.log(data);
  })
  .catch(err => {
    console.log("nono eh");
    console.log(err);
  });
}

//FROM OBS
obs.on('SwitchScenes', data => {
  //console.log(`New Active Scene: ${data.sceneName}`);
});

//LISTEN PORT
app.listen(port, () => {
  console.log('Listening on '+ip+':'+port)
});

//READWRITE CONFIG FILEs
//----------CONFIG
//const config = await config();
async function config(){
  return new Promise(resolve => {
  fs.readFile("storage/config.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      let obj = JSON.parse(jsonString);
      resolve(obj);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
  });
}
function configsave(config){
  const jsonString = JSON.stringify(config);
  fs.writeFile("storage/config.json", jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('config saved')
    }
})
}

//----------USEERDATA
//const config = await config();
async function session(){
  return new Promise(resolve => {
  fs.readFile("storage/userdata.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      let obj = JSON.parse(jsonString);
      resolve(obj);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
  });
}
function sessionsave(config){
  const jsonString = JSON.stringify(config);
  fs.writeFile("storage/userdata.json", jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('config saved')
    }
})
}

//LOADING CONFIGs
async function startupconfigs(){
  var configs = await config();

  if(easymidi.getInputs().includes(configs.midi.input))
    myinput = new easymidi.Input(configs.midi.input);
  if(easymidi.getOutputs().includes(configs.midi.output))
    myoutput = new easymidi.Output(configs.midi.output);
  
  port=configs.app.port;

  obsip=configs.services.obs;

  console.log('Devices set:'+ myinput.name+", "+myoutput.name);
}
async function sessioncongifs(){
  return await session();
}
async function scenebin(){
  return new Promise(resolve => {
  fs.readFile("storage/shows/sgt2022/scenes/bin.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      let obj = JSON.parse(jsonString);
      resolve(obj);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
  });
}


//----------MIDI code to note TRIGGER
var intervals = [];
function miditrigger(x,t){
  let i = setTimeout(() => {
    try {
      myoutput.send('cc', {
        channel: Math.floor(x/128),
        controller: x % 128,
        value: 0
      }) 
    } catch (error) {
      console.log("MIDI triggering failed:");
    }
  //console.log("midi "+x);
  console.log("midi "+x+" ("+Math.floor(x/128)+" "+x % 128+")")
  }, t);
  intervals.push(i);
}

// ############### Serving files
app.get('/testing', function(req, res) {
  res.sendFile(path.join(__dirname, 'static/testing/index.html'));
});

const files = [
  'style.css',
  'dataCom.js',
  'midiCom.js',
  'player.js',
  'style.css',
  'ui.js',
  'logo.ico'
];
const filesextra = [
  'account/style.css',
  'account/script.js'
]

servingfiles(files);

function servingfiles(files){
  files.forEach(file => {
    app.get('/'+file, function(req, res) {
      res.sendFile(path.join(__dirname, '/static/controlRoom/'+file));
    });
  });
  filesextra.forEach(file =>{
    app.get('/'+file, function(req, res) {
      res.sendFile(path.join(__dirname, '/static/'+file));
    });
  });
}

//logger
//session lasts 12h
app.use(expsession({ secret: 'keyboard cat', cookie: { maxAge: 60000*60*12 }}))

app.post('/auth', function(req, res) {
  let email=req.query.email;
  let pass=req.query.pass;

  let body = { password: "A", email: email, h:true };

  fetch('https://francescodandreastudente.altervista.org/showPilotREST/login.php?email='+email+'&password='+pass+'&h', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json()) // expecting a json response
    .then(json => {
      let response=json;
       if(response.result){
        req.session.logged=true;
        response.redirect="/";
        res.json(response);
       }else{
        res.send(response);
       }
    });
});

app.get('/', function(req, res) {
  if(req.session.logged)
  res.sendFile(path.join(__dirname, '/static/controlRoom/index.html'));
  else
  res.sendFile(path.join(__dirname, '/static/account/login.html'));
});
app.get('/logout', function(req, res) {
  req.session.logged=false;
  res.sendFile(path.join(__dirname, '/static/account/login.html'));
});
//npm start