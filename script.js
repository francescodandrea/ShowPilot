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

//PARSING
txtparsev2();

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
  res.send(await getlines())
  console.log("sent lines");
});
async function getlines(){
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
function txtparse(){
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
      
      let data=JSON.stringify(json);
      fs.writeFile('storage/lines.json', data, 'utf8',function(err) {
        if (err) throw err;
        console.log('Parsing complete');
        });
  });
}
function txtparsev2(){
  fs.readFile("storage/lines.txt", "utf8", (err, string) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }

      // Array contenente i nomi degli attori
      const allActors = ['SIMBA', 'NALA', 'ZAZU', 'CORO'];

      // Splitting the script section into lines
      const lines = string.split('\n');

      // Initializing an empty array to store dialogue arrays
      const dialoguesArray = [];

      // Variable to keep track of the current actor/scene/song
      let currentActorOrScene = '';

      // Looping through lines
      for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          // If the line is not empty
          if (line !== '') {
              // If the line contains at least one actor's name
              if (allActors.some(actor => line.includes(actor))) {
                  // If the line contains multiple actors' names
                  if (line.includes(',') || line.includes(' e ')) {
                      // Pushing a new dialogue array with all actors as the current actor/scene/song
                      dialoguesArray.push([line,allActors.join(', ')]);
                  } else {
                      // Find the specific actor in the line
                      const actorInLine = allActors.find(actor => line.includes(actor));
                      // Update the current actor
                      currentActorOrScene = actorInLine;
                  }
              } else {
                  // Check if it's a scene or a song
                  let actorOrScene = '';
                  if (line.startsWith('Scena') || line.startsWith('CANZONE:')) {
                      actorOrScene = 'scene';
                  }
                  // Pushing a new dialogue array with the current actor/scene/song and the dialogue
                  dialoguesArray.push([line, currentActorOrScene || actorOrScene]);
              }
          }
      }
      
      let data=JSON.stringify(dialoguesArray);
      fs.writeFile('storage/lines.json', data, 'utf8',function(err) {
        if (err) throw err;
        console.log('Parsing complete');
        });
  });
}
//**************** actors ****************
async function actors(){
  return new Promise(resolve => {
  fs.readFile("storage/actors.json", "utf8", (err, jsonString) => {
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