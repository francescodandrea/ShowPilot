const express = require('express');
const app = express();
var easymidi = require('easymidi');
const cors = require('cors');

const port = 8000;

app.use(
  cors({
    origin: "*",
  })
)
app.use('/static', express.static('public'));

//SERVER STARTUP

var inputs = easymidi.getInputs();
var outputs = easymidi.getOutputs();

var myinput=false;
var myoutput=false;

//SETTINGS

//SETUP COMMUNICATION
app.get('/devicelist', (req, res) => {
  console.log(`Getting devices`);
  let inputs = easymidi.getInputs();
  let outputs = easymidi.getOutputs();
  res.json({ "inputs": inputs, "outputs": outputs });
});
app.get('/devices', (req, res) => {
  console.log(`Getting devices`);
  res.json({ "input": myinput, "output": myoutput });
});
app.post('/devices', (req, res) => {
  if(req.query.in!="undefined")
    myinput = new easymidi.Input(req.query.in);
  if(req.query.out!="undefined")
    myoutput = new easymidi.Output(req.query.out);
  console.log('Devices set:'+ req.query.in+", "+req.query.out);
  res.json({ "log": "Devices set on server", "com": {"in": req.query.in, "out": req.query.out} });
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
app.put('/setdevices', (req, res) => {
  if(req.query.in!="undefined")
    myinput = new easymidi.Input(req.query.in);
  if(req.query.out!="undefined")
    myoutput = new easymidi.Output(req.query.out);

  console.log('Devices set:'+ req.query.in+", "+req.query.out);
  res.json({ "log": "Devices set on server", "com": {"in": req.query.in, "out": req.query.out} });
});
app.get('/ping', (req, res) => {
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

//npm start
