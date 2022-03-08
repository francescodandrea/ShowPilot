<?php
require_once './vendor/autoload.php';

if(!getenv('inHeroku')){
  $secrets = json_decode(file_get_contents("./rest/secrets.json"), true);

  // init configuration
  $clientID = $secrets["googleapi"]["clientID"];
  $clientSecret = $secrets["googleapi"]["clientSecret"];
  $redirectUri = 'http://localhost/account';
}{
  // init configuration
  $clientID = getenv('clientID');
  $clientSecret = getenv('clientSecret');
  $redirectUri = 'https://showpilot.herokuapp.com/account';
}

// create Client Request to access Google API
$client = new Google_Client();
$client->setClientId($clientID);
$client->setClientSecret($clientSecret);
$client->setRedirectUri($redirectUri);
$client->addScope("email");
$client->addScope("profile");
  
// authenticate code from Google OAuth Flow
if (isset($_GET['code'])) {
  $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
  $client->setAccessToken($token['access_token']);
   
  // get profile info
  $google_oauth = new Google_Service_Oauth2($client);
  $google_account_info = $google_oauth->userinfo->get();
  $email =  $google_account_info->email;
  $name =  $google_account_info->familyName;
  $name =  $google_account_info->givenName;
  $name =  $google_account_info->id;
  $name =  $google_account_info->picture;
  
  echo($name." ".$email);
  
  // now you can use this profile info to create account in your website and make user logged in.
} else {
  echo "<a href='".$client->createAuthUrl()."'>Google Login</a>";
}
?>