const express = require('express')
var easymidi = require('easymidi');

const app = express();
const port = 8000;

var inputs = easymidi.getInputs();
var outputs = easymidi.getOutputs();

app.use('/static', express.static('public'));

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