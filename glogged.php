<?php

if(isset($_GET["code"])){
    echo "ciao";
    $client->authenticate($_GET['code']);
    $access_token = $client->getAccessToken();

    $client->setAccessToken($access_token);

    $gauth=Oauth2($client);

    $user = $oauth2->userinfo->get();

    // These fields are currently filtered through the PHP sanitize filters.
    // See http://www.php.net/manual/en/filter.filters.sanitize.php
    $email = filter_var($user['email'], FILTER_SANITIZE_EMAIL);

    // The access token may have been updated lazily.
    $_SESSION['token'] = $client->getAccessToken();
    $_SESSION['email'] = $email;
    echo $email;

    $google_info=$gauth->userinfo->get();
    $email = $google_info->email;
    $name = $google_info->name;
    echo "Welcome ". $name.". You are registered using email: ".$email;

}


?>
