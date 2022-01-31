<?php
  if($_SERVER["SERVER_ADDR"] == "172.23.0.3"){
    echo "APP1 con address " . $_SERVER["SERVER_ADDR"];
  }else{
    echo "APP2 con address " . $_SERVER["SERVER_ADDR"];
  }
  include("Account/CheckConn.php");
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Form</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <script src='Script.js'></script>
    </head>
    <body>
      <div class="container d-flex justify-content-center align-items-center" style="margin-top: 15%;">
        <form method="post" action="Account/Login.php" style="display: block;" id="LoginForm">
            <h1 style="display: inline;">Login<div onclick="Change(id)" style="display:inline;color:darkgrey;cursor:pointer;" id="r"> Registrazione</div></h1>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" name="mail">
              <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input type="password" class="form-control" id="password" placeholder="Password" name="pass">
            </div>
            <button type="submit" class="btn btn-primary" style="margin-top: 2%;">Submit</button>
          </form>

          <form method="post" action="Account/Registrazione.php" style="display: none;" id="RegForm">
            <h1 style="display: inline;">Registrazione<div onclick="Change(id)" style="display:inline;color:darkgrey;cursor:pointer;" id="l"> Login</div></h1>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" name="mail">
              <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input type="password" class="form-control" id="Rpassword" placeholder="Password" name="pass" required>
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Confirm password</label>
              <input type="password" class="form-control" id="Rconfirm_password" placeholder="Confirm Password" name="confpass" required>
            </div>
            <button type="submit" class="btn btn-primary" style="margin-top: 2%;" onclick="return Validate()">Submit</button>
          </form>
      </div>
    </body>
</html>