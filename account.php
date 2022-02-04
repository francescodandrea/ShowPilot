<?php
    if(isset($_REQUEST["username"])){
        require ('./webchunks/login.php');
    } else {
        $logerr="Invalid login";
        $sigerr="Invalid sign up";
        require ('./webchunks/login.php');
    }

?>