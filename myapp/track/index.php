<?php

//test di connessione

$hostname = "db";
$username = "root";
$password = "notSecureChangeMe";
$db = "mydata";

$dbconnect=mysqli_connect($hostname,$username,$password,$db);

if ($dbconnect->connect_error) {
  die("Database connection failed: " . $dbconnect->connect_error);
}
$query = mysqli_query($dbconnect, "INSERT INTO `requests` (`timestamp`, `replica`) VALUES (CURRENT_TIMESTAMP, 't')")
   or die (mysqli_error($dbconnect));

?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<body>
<?php

$hostname = "db";
$username = "root";
$password = "notSecureChangeMe";
$db = "mydata";

try {
  $dbconnect=mysqli_connect($hostname,$username,$password,$db);
} catch (\Throwable $th) {
  //throw $th;
}
if ($dbconnect->connect_error) {
  die("Database connection failed: " . $dbconnect->connect_error);
}


?>

<table border="1" align="center">
<tr>
  <td>Timestamp</td>
  <td>Replica</td>
</tr>

<?php

$query = mysqli_query($dbconnect, "SELECT * FROM requests")
   or die (mysqli_error($dbconnect));

while ($row = mysqli_fetch_array($query)) {
  echo
   "<tr>
    <td>{$row['timestamp']}</td>
    <td>{$row['replica']}</td>
   </tr>\n";

}

?>
</table>
</body>
</html>