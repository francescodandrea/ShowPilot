<?php
$postdata = http_build_query(
    array(
        'email' => $_REQUEST['email'],
        'username' => $_REQUEST['username'],
        'name' => $_REQUEST['name'],
        'password' => $_REQUEST['password']
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