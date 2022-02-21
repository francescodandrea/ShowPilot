<?php
    session_start();

    if(isset($_SESSION["logged"]) && $_SESSION["logged"]==true){
        require ('./webchunks/login.php');
    } else {
        //$logerr="Invalid login";
        //$sigerr="Invalid sign up";
        require ('./rest/Gauth.php');
        require ('./webchunks/login.php');
    }

?>