<?php
session_start();
$username=$_SESSION["username"];
?>

<!DOCTYPE html>
<html>

<head>
    <title>ShowPilot</title>
</head>

<body>
<h1><span style="font-family: arial, helvetica, sans-serif;">My ShowPilot account</span></h1>
<hr />
<h2><span style="font-family: arial, helvetica, sans-serif;">Welcome, <?php echo $username ?></span></h2>

<a id="logout" href="./rest/logout" style="position:absolute; right:2em;">You might want to <button type="button">logout</button></a>

</body>
<style>
    h1 {
        margin-bottom: 0;
    }

    body>p:nth-child(2) {
        margin-top: 0;
        color: #bababa;
    }

    hr {
        width: 45em;
        margin-left: 0;
        background-color: #cccccc;
        border-width: 0;
        height: 2px;
    }

    a {
        color: inherit;
        text-decoration: none;
        padding: .5em;
    }
</style>

</html>