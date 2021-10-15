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

app.use('/static', express.static('public'));

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