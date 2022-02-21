<?php

require "./vendor/autoload.php";

/*
$gouthSecrets = json_decode(file_get_contents(".\client_secret.json"), true);
echo $gouthSecrets["web"]["client_id"];
var_dump($gouthSecrets);
*/
$clientID = '211776424215-gollvp5dbmplhdcualakcajfdcrrqp7e.apps.googleusercontent.com';
$clientSecret = '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';
$redirectUrl = 'https://showpilot.herokuapp.com/account';

// Creating client request to google

$client = new Google_Client();

$client->setClientId($clientID);
$client->setClientSecret ($clientSecret);
$client->setRedirectUri($redirectUrl);
$client->addScope("profile");

$client->addScope('email');

if(isset($_GET["code"])){
    $token-$client->fetchAccessTokenwithAuthCode ($_GET['code']);

    $client->setAccessToken ($token);

    //Getting User Profile Sgauth-new Google Service 1

    Oauth2($client);

    $google_info=$gauth->userinfo->get();
    $email = $google_info->email;
    $name = $google_info->name;
    echo "Welcome ". $name.". You are registered using email: ".$email;

} else {
    echo "<a href=". $client->createAuthurl().">Login with Google</a>";
}

