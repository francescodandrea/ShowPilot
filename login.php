<?php

?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>ShowPilot</title>
        <!-- Favicon-->
        <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
        <!-- Bootstrap icons-->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet" />
        <!-- Core theme CSS (includes Bootstrap)-->
        <link href="css/styles.css" rel="stylesheet" />
    </head>
    <body>
        <!-- Responsive navbar-->
        <?php include 'webchunks/navbar.php' ?>

        <!-- Header-->
        <header class="bg-dark py-5">
            <div class="container px-5">
                <div class="row gx-5 justify-content-center">
                    <div class="col-lg-6">
                        <div class="text-center my-5">
                        <h2>Create your account</h2>
                        <form action="validatelogin.php" method="POST">
                            <label for="username">Username:</label><br>
                            <input type="text" class="form-control" name="username" value="" autocomplete="off" required><br><br>
                            <label for="password">Password:</label><br>
                            <input type="text" class="form-control" name="password" value="" autocomplete="off" required><br>
                            <input type="text" class="form-control" value="" autocomplete="off" required placeholder="verify"><br><br>
                            <input class="btn btn-primary" type="submit" value="Signup">
                        </form> <br><br>
                        <h2>Login</h2>
                        <form action="validatelogin.php" method="POST">
                            <label for="username">Username:</label><br>
                            <input type="text" class="form-control" name="username" value="" autocomplete="off" required><br>
                            <label for="password">Password:</label><br>
                            <input type="text" class="form-control" name="password" value="" autocomplete="off" required><br><br>
                            <input class="btn btn-primary" type="submit" value="Login">
                        </form> 
                        <style>
                            label {
                                color: #ffffffc4;
                            }
                            h2{
                                color:white;
                            }
                        </style>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <!-- Bootstrap core JS-->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
        <!-- Core theme JS-->
        <script src="js/scripts.js"></script>

    </body>
</html>
