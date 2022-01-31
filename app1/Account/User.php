<?php
class user{
  private $id;
  private $mail;
  private $psw;
  //private $hashm;
  private $hashp;

  function __construct($m, $p){
    $this->id = $this->identifier();
    $this->mail=$m;
    $this->psw=$p;
    //$this->hashm = password_hash($this->mail, PASSWORD_BCRYPT);
    $this->hashp = password_hash($this->psw, PASSWORD_BCRYPT);
  }
  function PswHash(){
    if(password_verify($this->psw, $this->hashp)){ //Verifica che la password corrisponda all'hash
      return true;
    }
    return false;
  }
  function CheckNotExist(){
    $ma = $this->mail;
    $con=mysqli_connect("db","MYSQL_USER","MYSQL_PASSWORD","MYSQL_DATABASE");
    $query="select * from users where mail='$ma'";
    $result = mysqli_query($con,$query);
    if (mysqli_num_rows($result) > 0) {
      return false; //Utente esiste 
    } else {
      return true;  //Utente non esiste
    }
  }
  function SaveUser(){
    $ma = $this->mail;
    $ps = $this->hashp;
    $con=mysqli_connect("db","MYSQL_USER","MYSQL_PASSWORD","MYSQL_DATABASE");
    $query="INSERT INTO users(mail, psw) VALUES('".$ma."','".$ps."')";
    if (mysqli_query($con,$query)) {
      return true; //Utente aggiunto
    } else {
      echo mysqli_error($con);
      return false;  //Utente non aggiunto
    }
  }
  function login(){
    $ma = $this->mail;
    $con=mysqli_connect("db","MYSQL_USER","MYSQL_PASSWORD","MYSQL_DATABASE");
    $query="select * from users where mail='$ma'";
    $result = mysqli_query($con,$query);
    if (mysqli_num_rows($result) > 0) {
      $row = mysqli_fetch_assoc($result);
      if(password_verify($this->psw, $row["psw"])){
        echo "Login effettuato";
        return true;
      }
    } else {
      echo "Utente non esistente, effettuare la registrazione";
      return false;
    }
  }
  function identifier(){
    return uniqid("", true);;
  }
  function getID(){
    return $this->id;
  }
}
?>
