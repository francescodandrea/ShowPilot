<?php

$postdata = http_build_query(
    array(
        'username' => $_REQUEST['username'],
        'password' => hash('sha256',$_REQUEST['password'])
    )
);
$opts = array('http' =>
    array(
        'method' => 'POST',
        'header' => 'Content-type: application/x-www-form-urlencoded',
        'content' => $postdata
    )
);
$context = stream_context_create($opts);
//$result = file_get_contents('https://francescodandreastudente.altervista.org/showPilotREST/signup', false, $context);

if($result["result"]){
    require ('../page.php');
}{
    $sigerr=$result["message"];
    require ('../account.php');
}

?>