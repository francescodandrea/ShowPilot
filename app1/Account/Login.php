<?php
session_start(); 
include('User.php');

if($_SERVER["REQUEST_METHOD"] == 'POST' && !isset($_POST["Iotp"])){ //Richiesta per il login
    $mail = $_POST["mail"];
    $pass = $_POST["pass"];
    $Hmail = password_hash($mail, PASSWORD_BCRYPT); //Genero hash della mail per il token otp
    $Hpass = password_hash($pass, PASSWORD_BCRYPT); //Genero hash password per il token otp
    $usr = new user($mail, $pass);
    $scelta = $usr -> login();  //Controllo le credenziali inserite dall'utente tramite la funzione nella classe
    if($scelta){ 
        /*header("Location: -----------------------------------------------------");
        exit();*/
    }else{
        echo "Credenziali errate";
    }
}
?>
