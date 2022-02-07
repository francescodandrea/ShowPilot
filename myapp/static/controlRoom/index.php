<?php


$hostname = "db";
$username = "root";
$password = "notSecureChangeMe";
$db = "mydata";

$dbconnect=mysqli_connect($hostname,$username,$password,$db);

if ($dbconnect->connect_error) {
  die("Database connection failed: " . $dbconnect->connect_error);
}

$query = mysqli_query($dbconnect, "INSERT INTO `requests` (`timestamp`, `replica`) VALUES (NULL, 'A')")
   or die (mysqli_error($dbconnect));

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#1f2226" />

    <title>Control room</title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    
    <link rel="stylesheet" href="style.css">
    
    <script src="dataCom.js" defer></script>
    <script src="midiCom.js" defer></script>
    <script src="ui.js" defer></script>
    <script src="player.js" defer></script>
    
    <script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css">
    
</head>
<body>
    <!-- A horizontal nav -->
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark spacenav">
            <a class="navbar-brand">Control room</a>
            <p id="status_server" onclick="ping()" class="status unk">Server</p>
            <p id="status_miin" onclick="getdevices()" class="status unk">MIDI in</p>
            <p id="status_miout" onclick="getdevices()" class="status unk">MIDI out</p>
            <p id="status_obs" onclick="ping()" class="status unk">OBS</p>
      </nav>
  
<div id="container">  

    <!-- A vertical navbar -->
    <nav class="navbar bg-dark navbar-dark mainnav">

        <!-- Links -->
        <ul class="navbar-nav">
        
        <li class="nav-item">
            <p class="nav-link" onclick="section('scenes')">Scene collection</p>
        </li>
        <li class="nav-item">
            <p class="nav-link" onclick="section('sequences')">Sequence editor</p>
        </li>
        <li class="nav-item">
            <a class="nav-link" onclick="section('live')">Live</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" onclick="section('devices')">Devices</a>
        </li>
        </ul>
    
    </nav>

    <div id="sectionholder">
        <section id="scenes">
            <div>
                <h2 style="float: left">Scene collection</h2>
                <div class="input-group" style="width: fit-content; margin-left: auto">
                    <button class="btn btn-secondary" id="state_play" type="button" onclick="collectionstate('play')"><i class="bi bi-play-fill"></i></button>
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" id="state_edit" type="button" onclick="collectionstate('edit')"><i class="bi bi-pencil-fill"></i></button>
                        <button class="btn btn-outline-danger" id="state_delete" type="button"  onclick="collectionstate('delete')"><i class="bi bi-trash-fill"></i></button>
                    </div>
                </div>
            </div>
            <div id="scenecollection">
            </div>

            <div class="tilecontainer">
                <div id="sceneedit" class="edittile">
                    <i class="bi bi-x" onclick="tile('sceneedit')"></i>
                    
                        <div>
                            <h3>New scene</h3>
                            <label>ID:</label>
                            <input type="number" class="form-control" id="tsn_key" min="0" max="2048" disabled><br>
                            <label>Name:</label>
                            <input type="text" class="form-control" id="tsn_name" onchange="tilescenepreview()" autocomplete="off"><br>
                            <label>Category:</label>
                            <select id="tsn_category" onchange="tilescenepreview()" class="form-control"></select>
                            <br><label>Colors:</label>
                            <input type="color" class="form-control" id="tsn_color1" onchange="tilescenepreview()">
                            <input type="color" class="form-control" id="tsn_color2" onchange="tilescenepreview()">
                        </div>
                        <div id="tilescenepreview"></div>
                        <div style="flex-basis:100%"></div>
                        <div>
                            <i class="bi bi-bezier nail checked" id="tsn_moving" title="Moving fixtures" onclick="tiletoggletypes(this),tilescenepreview()" > Animated</i>
                            <i class="bi bi-lightning-fill nail" id="tsn_strobo" title="Flashing lights" onclick="tiletoggletypes(this),tilescenepreview()"> Strobo</i>
                            <i class="bi bi-cloud-haze2-fill nail" id="tsn_smoky" title="Active smoke machines" onclick="tiletoggletypes(this),tilescenepreview()"> Foggy</i>
                            <i class="bi bi-stars nail" id="tsn_pyro" title="Active pyro or special effects" onclick="tiletoggletypes(this),tilescenepreview()"> Pyro</i>
                            <i class="bi bi-people-fill nail" id="tsn_audience" title="Lights pointing towards the audience" onclick="tiletoggletypes(this),tilescenepreview()"> Audience</i>
                        </div>
                        <button class="btn btn-primary" onclick="tilescenesave()">Create</button>
                        
                        <button class="btn btn-danger" style="display:none" onclick="tilescenedelete(true)">Delete</button>
                </div>
            </div>
            
        </section>
        <section id="sequences">
            <h2>Sequence editor</h2>
            <div id="sqplayer">
                <div class="input-group">
                    <select id="seqselect"  onchange="sequence(this.value)" class="form-control"></select>
                    <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" onclick="se_play()"><i class="bi bi-play-fill"></i></button>
                    <button class="btn btn-outline-secondary" type="button" onclick="se_stop()"><i class="bi bi-pause-fill"></i></button>
                    <button class="btn btn-outline-danger" type="button" onclick="se_reset()"><i class="bi bi-stop-fill"></i></button>
                    <button class="btn btn-secondary ml-2" type="button" onclick="tile('sequenceedit')"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-secondary" id="savebtn" type="button" onclick="se_save()"><i class="bi bi-cloud-arrow-up-fill"></i></button>
                    <button class="btn btn-secondary ml-2" type="button" onclick="tile('sequenceedit')"><i class="bi bi-file-earmark-plus-fill"></i></button>
                    </div>
                </div>
            </div>
            <div id="obsplayer">
                <div class="input-group">
                    <select id="obsselect" class="form-control">
                    </select>
                    <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" onclick="obs_play()"><i class="bi bi-play-fill"></i></button>
                    <button class="btn btn-outline-secondary" type="button" onclick="obs_reset()"><i class="bi bi-stop-fill"></i></button>
                    </div>
                </div>
            </div>
            <div id="seqcomposer"> </div>

            <div id="videocomp">
                <video height="400" id="vid" controls>
                    <source src="videostream" type="video/mp4">
                </video>
            </div>

            <div class="tilecontainer">
                <div id="sequenceedit" class="edittile">
                    <i class="bi bi-x" onclick="tile('sequenceedit')"></i>
                        <div>
                            <h3>New sequence</h3>
                            <label>File:</label>
                            <input type="text" id="tsq_file" class="form-control" autocomplete="off"><br>
                            <label>Name:</label>
                            <input type="text" id="tsq_name" class="form-control" autocomplete="off"><br>
                            <label>Type:</label>
                            <select id="tsq_type" class="form-control">
                                <option>Intro</option>
                                <option>Act</option>
                                <option>Interval act</option>
                                <option>Outro</option>
                                <option>Ambient</option>
                            </select>
                        </div>
                        <div id="tilescenepreview"></div>
                        <div style="flex-basis:100%"></div>
                        <button class="btn btn-primary" onclick="tilesequencesave()">Create</button>
                        
                        <button class="btn btn-danger" style="display:none" onclick="tilesequencedelete(true)">Delete</button>
                </div>
            </div>
        </section>
        <section id="live">
            <h2>Live</h2>
            <div class="input-group" id="liveplayer">
                
                <select id="liveselect"  onchange="sequence(this.value)" class="form-control"></select>
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary" type="button" onclick="se_play()"><i class="bi biduble bi-play-fill"></i></button>
                  <button class="btn btn-outline-secondary" type="button" onclick="se_stop()"><i class="bi biduble bi-pause-fill"></i></button>
                  <button class="btn btn-outline-secondary" type="button" onclick="se_reset()"><i class="bi biduble bi-stop-fill"></i></button>
                </div>
            </div>
        </section>
        <section id="devices">
            <form class="form-inline">

                <div class="input-group mb-2">
                    <div class="input-group-prepend">
                    <button type="button" class="btn btn-secondary" onclick="getdevicelist()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
                    </div>
                    <button type="button" class="btn btn-outline-secondary" onclick="setdevices()">Set</button>
                </div>

                <div class="input-group mb-2">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="inputGroupSelect01">Input device</label>
                    </div>
                    <select class="custom-select" id="inputGroupSelect01">
                    </select>
                </div>

                <div class="input-group mb-2">
                    <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">Output device</label>
                    </div>
                    <select class="custom-select" id="inputGroupSelect02">
                    </select>
                </div>

                <hr>

                <div class="input-group mb-2 mr-sm-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">Server IP</div>
                    </div>
                    <input type="text" class="form-control" id="serverip" onchange="serveripsave(this.value)" value="" autocomplete="off">
                    <div class="input-group-prepend">
                    </div>
                </div>
            
            </form>
        </section>
    </div>
</div>
</body>
</html>