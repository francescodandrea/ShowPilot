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