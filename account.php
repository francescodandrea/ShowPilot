<?php
    if(isset($_REQUEST["username"])){

    } else {
        $logerr="Invalid login";
        $sigerr="Invalid sign up";
        require ('./webchunks/login.php');
    }

?>