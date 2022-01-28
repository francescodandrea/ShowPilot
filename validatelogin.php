<?php
    $err="";
    $code="";

    if(isset($_REQUEST["nome"]) && isset($_REQUEST["cognome"])){
        if($_REQUEST["nome"]!="" && $_REQUEST["cognome"]!=""){
            $nome=$_REQUEST["nome"];
            $cognome=$_REQUEST["cognome"];

            $consonanti = preg_replace('#[aeiou\s]+#i', '', $cognome);
            $code=substr($consonanti, 0, 3);
            $consonanti = preg_replace('#[aeiou\s]+#i', '', $nome);
            $code=$code . substr($consonanti, 0, 3);

            $chunks = explode("@", $_REQUEST["email"]);

          } else {
              $err="Compila entrambi i campi";
          }
    } else {
        $err="Compila entrambi i campi";
    }

?>