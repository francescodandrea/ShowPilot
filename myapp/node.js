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

var inputs = easymidi.getInputs();
var outputs = easymidi.getOutputs();

var myinput=false;
var myoutput=false;

app.use('/static', express.static('public'));

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
    myoutput = new easymidi.Input(req.query.out);

  console.log('Devices set:'+ req.query.in+", "+req.query.out);
  //res.json({ "log": "Devices set on server" });
});
app.get('/testsend', (req, res) => {
  console.log(`Sending`);
  res.json({ state: 'Sent' })
});
app.get('/testrecive', (req, res) => {
  console.log(`Reciving`);
  res.json({ state: 'Recived', note: 100 })
});

app.get('/controlRoom', (req, res) => {
  res.sendFile('static/controlRoom/index.html', {root: __dirname })
});

app.get('/testing', (req, res) => {
  res.sendFile('static/testing/index.html', {root: __dirname })
});

app.get('/', (req, res) => {
  console.log(inputs);
  console.log(outputs);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

//npm start