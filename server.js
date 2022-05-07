const express = require("express");
var path = require('path'); //path express
const app = express()

const cors = require("cors") // importing the `cors` package
app.use(cors()) // tells Express to use `cors`, and solves the issue

app.listen(3000) // tells Express which port to listen on

app.get('/videostream', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'assets/'+req.query.file));
  } catch (error) {
    res.json({ "error": error });
  }
});