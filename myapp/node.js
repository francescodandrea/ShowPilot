const express = require('express'); //express
const app = express();
var easymidi = require('easymidi'); //midi com
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

startupconfigs();

//SETTINGS

//SETUP COMMUNICATION
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

//TO MIDI
app.post('/sendcc', (req, res) => {
  console.log(req.query.channel+" "+req.query.controller+" "+req.query.value)
  
  myoutput.send('cc', {
    channel: parseInt(req.query.channel),
    controller: parseInt(req.query.controller),
    value: parseInt(req.query.value)
  });

  res.json({ "log": "CC sent "+req.query.channel+' '+req.query.controller+' '+req.query.value, "com": {"in": req.query.in, "out": req.query.out} });
});

//FROM MIDI

//testing only
app.get('/testdevices', (req, res) => {
  console.log(`Getting devices`);
  var inputs = easymidi.getInputs();
  var outputs = easymidi.getOutputs();
  res.json({ "inputs": inputs, "outputs": outputs });
});
app.get('/ping', async (req, res) => {
  //console.log(`Pong`);
  res.json({ state: 'Pong' })
});
app.get('/controlRoom', (req, res) => {
  res.sendFile('static/controlRoom/index.html', {root: __dirname })
});
app.get('/testing', (req, res) => {
  res.sendFile('static/testing/index.html', {root: __dirname })
});

//LISTEN PORT
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

//READWRITE FILE
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
async function startupconfigs(){
  var configs = await config();

  if(easymidi.getInputs().includes(configs.devices.input))
    myinput = new easymidi.Input(configs.devices.input);
  if(easymidi.getOutputs().includes(configs.devices.output))
    myoutput = new easymidi.Output(configs.devices.output);

    console.log('Devices set:'+ myinput.name+", "+myoutput.name);
}

//npm start
