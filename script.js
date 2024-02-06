const express = require('express'); //express
const app = express();
app.use(express.json());
var path = require('path'); //path express
const fetch = require('node-fetch'); //HTTP Requests
const cors = require('cors'); //cors made east
var os = require('os'); // ip getter
const fs = require("fs"); //file reading

var port = 8000;
var ip = true;
//console.log(os.networkInterfaces())
ip = os.networkInterfaces()['en0'][1].address;

app.use(
  cors({
    origin: "*",
  })
)
app.use('/static', express.static('public'));

//LISTEN PORT
app.listen(port, () => {
  console.log('Listening on '+ip+':'+port)
});

//SETTINGS --------------
//setup communication
app.get('/ping', async (req, res) => {
  //console.log(`Pong`);
  res.json({ state:'Pong', currentl : currentline});
});

var currentline=0;

//------------STORAGE --------------
//**************** lines ****************
app.get('/lines', async (req, res) => {
  //res.send(await lines())
  res.send(await linestxt())
  console.log("sent lines");
});
async function lines(){
  return new Promise(resolve => {
  fs.readFile("storage/lines.json", "utf8", (err, jsonString) => {
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
linestxt();
async function linestxt(){
  return new Promise(resolve => {
  fs.readFile("storage/lines.txt", "utf8", (err, string) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
      let json=[];
      //string=string.slice(0,11072);
      let cuts=[];
      let cuttoo=[];

      const nomi=["CHICCA","YURI","LUCA","LISA","PALA","DIANA","MARGHE","WILLY","LEO","TUTTI"];

      for (var i = 0; i < string.length; i++) {
        if (string.charAt(i)==":"){
         let src=string.slice(i-6,i);
         let res=false;
         let cut=null;

         let possiblenames=nomi;
         possiblenames.forEach((nome,i) => {
          if(src.includes(nome)){
            cut=i+1; res=true;
            return 0;
          }
         });
         
        if(res){
          cuts.push(i);
          cuts.push(cut);
        }
        }
        if (string.charAt(i)=="("){

          let close=i+1;
          do {
            close++;
          } while (string.charAt(close)!=")")

           cuttoo.push(i);
           cuttoo.push(close);
         }
      }

      //console.log(cuttoo)
      // round 2
      let open=null;
      let close=null;
      let actor=null;
      let index=0;

      do {
        //if (open==null){ open=i; i=i+2; } //O I++
        
        if(cuts[0]){
          open=cuts[0]+2; actor=cuts[1];
          if(cuts[2]) {
            close=cuts[2]-nomi[cuts[3]-1].length-1; index=cuts[2];
          } else {
            close=string.length;
          }
          cuts.shift();cuts.shift();
        }

        let line=string.slice(open,close);
        if(line.match(/esce|Esce/) || line.match(/entra|Entra/)){
          if(line.match(/esce|Esce/)){
            json.push([string.slice(open,close),actor,false]);
          } else 
          json.push([string.slice(open,close),actor,true]);
        } else 
          json.push([string.slice(open,close),actor]);
        
        open=null; close=null;

        /*
        if(cuts[0]){
          close=cuts[0]-nomi[cuts[1]-1].length-1; i=cuts[0];
          actor=cuts[1];
        }
        
        if(actor){
          json.push([string.slice(open,close),actor]);
          open=null; close=null;
        }*/
      } while (cuts[0])

      //console.log(json);
      resolve(json);
  });
  });
}

app.put('/current', (req, res) => {
  if(req.query.l!="undefined")
  currentline=req.query.l;
  console.log('Set:'+ req.query.l);

  res.json({ "log": "Set on server", "com": req.query.l});
});

const files = [
  'style.css',
  'data.js',
  'ui.js',
  'logo.ico',
  'bootstrap.min.css',
  'bootstrap-icons.css',
  'bootstrap.min.js',
  'bootstrap.min.css.map',
  'fonts/bootstrap-icons.woff2',
  'bootstrap.min.js.map',
  'jquery-2.1.3.min.js'
];

servingfiles(files);

function servingfiles(files){
  files.forEach(file => {
    app.get('/'+file, function(req, res) {
      res.sendFile(path.join(__dirname, '/static/'+file));
    });
  });
}

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});
//npm start