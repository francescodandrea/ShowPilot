<?php

session_set_cookie_params(3600,"/");
session_start();

require './vendor/autoload.php';

if(getenv('inHeroku') !== false){
  // init configuration
  $clientID = getenv('clientID');
  $clientSecret = getenv('clientSecret');
  $redirectUri = 'https://showpilot.herokuapp.com/account';
} else {
  $secrets = json_decode(file_get_contents("./rest/secrets.json"), true);

  // init configuration
  $clientID = $secrets["googleapi"]["clientID"];
  $clientSecret = $secrets["googleapi"]["clientSecret"];
  $redirectUri = 'http://francescodandreastudente.altervista.org/showPilot/account';
}

// create Client Request to access Google API
$client = new Google_Client();
$client->setClientId($clientID);
$client->setClientSecret($clientSecret);
$client->setRedirectUri($redirectUri);
$client->addScope("email");
$client->addScope("profile");
  

if(isset($_SESSION['Gauth'])){
	$tempglogin_email=$_SESSION['Gauth']['email'];
    require('rest/tempglogin.php');
    if($tempglogin_check){
    	$_SESSION["username"]=$tempglogin_username;
    	$_SESSION["logged"]=true;
		header("location: https://francescodandreastudente.altervista.org/showPilot/account");
    } else {
		header("location: https://francescodandreastudente.altervista.org/showPilot/account?le=Gauth error. Please log in using your email and password.");
    }
} else {
// authenticate code from Google OAuth Flow
if(isset($_REQUEST['code'])) {
  $token = $client->fetchAccessTokenWithAuthCode($_REQUEST['code']);
  $client->setAccessToken($token['access_token']);
   
  // get profile info
  $google_oauth = new Google_Service_Oauth2($client);
  $google_account_info = $google_oauth->userinfo->get();
  $_SESSION['Gauth']['email'] = $google_account_info->email;
  $_SESSION['Gauth']['familyName'] = $google_account_info->familyName;
  $_SESSION['Gauth']['givenName'] = $google_account_info->givenName;
  $_SESSION['Gauth']['id'] = $google_account_info->id;
  $_SESSION['Gauth']['picture'] = $google_account_info->picture;
  
  $tempglogin_email=$_SESSION['Gauth']['email'];
  require('rest/tempglogin.php');
  if($tempglogin_check){
    $_SESSION["username"]=$tempglogin_username;
    $_SESSION["logged"]=true;
	header("location: https://francescodandreastudente.altervista.org/showPilot/account");
  } else {
    require('webchunks/setuppass.php');
  }
  // now you can use this profile info to create account in your website and make user logged in.
} else {
  $authurl=$client->createAuthUrl();
}
}
?>