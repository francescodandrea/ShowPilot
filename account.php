<?php

	session_set_cookie_params(3600); 
    session_start();

    if(isset($_SESSION["logged"]) && $_SESSION["logged"]==true){
        require ('./page.php');
    } else {
        //$logerr="Invalid login";
        //$sigerr="Invalid sign up";
        
        $logerr=$_GET["le"];
        $sigerr=$_GET["se"];
        
        if(!isset($sigerr) && !isset($logerr) || isset($_GET["code"])) {
        	require ('rest/Gauth.php');
        }
        require ('webchunks/login.php');
    }

?>