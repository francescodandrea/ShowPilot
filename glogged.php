<?php

if(isset($_GET["code"])){
    echo "ciao";
    $token=$client->fetchAccessTokenwithAuthCode($_GET['code']);

    /*$client->setAccessToken ($token);

    //Getting User Profile Sgauth-new Google Service 1

    $gauth=Oauth2($client);

    $google_info=$gauth->userinfo->get();
    $email = $google_info->email;
    $name = $google_info->name;
    echo "Welcome ". $name.". You are registered using email: ".$email;
*/
}


?>
