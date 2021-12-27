const express = require('express'); //express
const app = express();
app.use(express.json());
var path = require('path'); //path express
var easymidi = require('easymidi'); //midi com
const OBSWebSocket = require('obs-websocket-js'); //obs
const obs = new OBSWebSocket();
const cors = require('cors'); //cors made east
const fs = require("fs"); //file reading

const port = 8000;

app.use(
  cors({
    origin: "*",
  })
)
app.use('/static', express.static('public'));

//SERVER STARTUP

var myinput=false;
var myoutput=false;

startupconfigsmidi();

obs.connect({ address: 'localhost:4444'})

//SETTINGS
//setup communication
app.get('/ping', async (req, res) => {
  //console.log(`Pong`);
  let obsping;
  obs.connect({ address: 'localhost:4444'})
  .then(a =>{
    obsping=true;
  })
  .catch(err => {
    obsping=false;
  });
  res.json({ state:'Pong', server:true, "miin": myinput.name, "miout": myoutput.name, "obs": obsping});
});
app.get('/devicelist', (req, res) => {
  console.log(`Getting devices`);
  let inputs = easymidi.getInputs();
  let outputs = easymidi.getOutputs();
  res.json({ "inputs": inputs, "outputs": outputs });
});
app.get('/devices', (req, res) => {
  //console.log(`Getting devices`);
  res.json({ "input": myinput.name, "output": myoutput.name });
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

//storage
app.get('/collection', async (req, res) => {
  res.send(await collection())
  //console.log("sent collection");
});
app.put('/collection', async (req, res) => {
  await collectionsave(req.body)
  res.send("done");
});
app.get('/sequence', async (req, res) => {
  res.send(await sequence(req.query.file));
  console.log("sent sequence");
});
app.put('/sequence', (req, res) => {
  sequencesave(req.body);
});
app.get('/sequencenew', async (req, res) => {
  res.send(await sequencenew());
  console.log("created sequence");
});
app.get('/show', async (req, res) => {
  res.send(await show(req.query.file));
  console.log("sent show");
});
app.put('/show', (req, res) => {
  showsave(req.body);
});

//TO MIDI
app.post('/goscene', (req, res) => {
  myoutput.send('cc', {
    channel: Math.floor(req.query.index/128),
    controller: req.query.index % 128,
    value: 0
  });

  console.log("midi "+req.query.index+" ("+Math.floor(req.query.index/128)+" "+req.query.index % 128+")")
  res.send();
});
app.post('/play', async (req, res) => {
  let data=await sequence(req.query.file);
  let seq=data.seq;

  obsscenetrigger(data.meta.obsscene);

  for (var key in seq) {
      if(seq[key]!="null") miditrigger(seq[key],key);
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
    console.log("Obs isn't active");
  });
}

//FROM OBS
obs.on('SwitchScenes', data => {
  //console.log(`New Active Scene: ${data.sceneName}`);
});

//LISTEN PORT
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

//READWRITE FILE
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

//SAVING CONFIG
async function savedevices(){
  var configs = await config();
  configs.devices.input=myinput.name;
  configs.devices.output=myoutput.name;
  configsave(configs);
}
//LOADING CONFIGs
async function startupconfigsmidi(){
  var configs = await config();

  if(easymidi.getInputs().includes(configs.devices.input))
    myinput = new easymidi.Input(configs.devices.input);
  if(easymidi.getOutputs().includes(configs.devices.output))
    myoutput = new easymidi.Output(configs.devices.output);

    console.log('Devices set:'+ myinput.name+", "+myoutput.name);
}

//----------SCENE COLLECTION
async function collection(){
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
async function collectionsave(scene){
  let collect = await collection();
  collect[scene.key]={};
  collect[scene.key]["name"]=scene.name;
  collect[scene.key]["color1"]=scene.color1;
  collect[scene.key]["color2"]=scene.color2;
  const jsonString = JSON.stringify(collect);
  fs.writeFile("storage/shows/sgt2022/scenes/scenes.json", jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('config saved')
    }
})
}
//----------SEQUENCE
async function sequence(name){
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
function sequencesave(data){
  const jsonString = JSON.stringify(data);
  fs.writeFile("storage/shows/sgt2022/sequences/"+data.meta.file+".json", jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('sequence '+data.meta.name+' saved');
    }
})
}
async function sequencenew(){
  const jsonString = JSON.stringify(await sequence("template"));
  fs.writeFile("storage/shows/sgt2022/sequences/new.json", jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('new sequence created');
    }
  })
  return sequence("new");
}
function sequencename(collect, name){
  const jsonString = JSON.stringify(collect);
  fs.writeFile("storage/shows/sgt2022/sequences/"+name+".json", jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('sequence saved')
    }
})
}

//----------SHOW
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

//----------MIDI code to note TRIGGER
var intervals = [];
function miditrigger(x,t){
  let i = setTimeout(() => {
    myoutput.send('cc', {
      channel: Math.floor(x/128),
      controller: x % 128,
      value: 0
    });
  //console.log("midi "+x);
  console.log("midi "+x+" ("+Math.floor(x/128)+" "+x % 128+")")
  }, t);
  intervals.push(i);
}

// ############### Serving files

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/static/controlRoom/index.html'));
});

app.get('/testing', function(req, res) {
  res.sendFile(path.join(__dirname, 'static/testing/index.html'));
});

const files = [
  'style.css',
  'dataCom.js',
  'midiCom.js',
  'player.js',
  'style.css',
  'ui.js'
]

servingfiles(files);

function servingfiles(files){
  files.forEach(file => {
    app.get('/'+file, function(req, res) {
      res.sendFile(path.join(__dirname, '/static/controlRoom/'+file));
    });
  });
}

//npm start
