<?php
include('User.php');

if($_SERVER["REQUEST_METHOD"] == 'POST'){
      $mail = $_POST["mail"];
      $pass = $_POST["pass"];
      $usr = new user($mail, $pass);
      $PswStatus = $usr -> PswHash(); //Controllo tramite la funzione della classe se l'hash della password é andato a buon fine
      if(!$PswStatus){
        echo "Errore nel salvataggio";  //Se l'hash non é andato a buon fine ho errore
      }else{
        $SavedStatus = $usr -> CheckNotExist();  //Controllo tramite la funzione della classe che non esista giá un account con la mail inserita
        if(!$SavedStatus){
          echo "Utente giá esistente";  
        }else{
          $id = $usr -> SaveUser();  //Se non ho nessun errore allora salvo l'utente su file;
          if($id ==true){
            echo "Utente salvato";
          }else{
            echo "Utente non salvato";
          }
          /*header("Location: -------------------------------------");
          exit();*/
        }
      }
}

?>
