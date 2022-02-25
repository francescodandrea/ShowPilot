<?php

$postdata = http_build_query(
    array(
        'username' => $_REQUEST['username'],
        'name' => $_REQUEST['name'],
        'password' => "aaa"
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
$result = file_get_contents('https://francescodandreastudente.altervista.org/showPilotREST/signup', false, $context);
echo $result;

?>