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
        <div class="bg-dark py-5 filler">
            <div class="container px-5">
                <div class="row gx-5 justify-content-center">
                    <div class="col-lg-6">
                        <div class="text-center my-5">

                            <div id="signupform">
                                <h2>Complete your account</h2><br>
                                <p style="color:red"><?php if(isset($sigerr)) echo $sigerr ?></p>
                                <form action="rest/completeaccount" method="POST">
                                    <div class="input-group">
                                            <input type="password" class="form-control" name="password" value="" autocomplete="off" required placeholder="Password">
                                            <input type="password" class="form-control" name="passwordcheck" value="" autocomplete="off" required placeholder="Retype password">
                                    </div><br>
                                    <input class="btn btn-primary" type="submit" value="Save">
                                </form>
                            </div>
                        <style>
                            label {
                                color: #ffffffc4;
                            }
                            h2{
                                color:white;
                            }
                            .hidden{
                                display:none;
                            }
                            a{
                                color:#ffffff40;
                                text-decoration: underline;
                                cursor:pointer;
                                user-select: none;
                            }
                            p{
                                color:white;
                                user-select: none;
                            }
                            p.link{
                                color:white;
                                text-decoration: underline;
                                cursor:pointer;
                                user-select: none;
                            }
                            html, body {
                                height:100%;
                                overflow:hidden;
                            }
                            .filler{
                                height: -webkit-fill-available;
                            }
                            @media (max-width: 992px) {
                                .container {
                                    max-width: 30em;
                                }
                            }
                            @media (min-width: 992px) {
                                .container {
                                    max-width: 60em;
                                }
                            }
                        </style>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Bootstrap core JS-->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
        <!-- Core theme JS-->
        <script src="js/login.js"></script>

    </body>
</html>
