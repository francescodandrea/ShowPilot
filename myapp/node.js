const express = require('express')
var easymidi = require('easymidi');

const app = express();
const port = 8000;

var inputs = easymidi.getInputs();
var outputs = easymidi.getOutputs();

app.get('/', (req, res) => {
  res.send('Hello World!');
  console.log(inputs);
  console.log(outputs);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});