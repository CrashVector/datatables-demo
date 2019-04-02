<?php

$host = "xxx.xx.xxx.xx";
$user = "user";
$pass = "pass";
$db = 'db';



$mysqli = new mysqli($host, $user, $pass, $db);
if ($mysqli->connect_error)
{
	echo "Can't connect: $mysqli->errno() $mysqli->error()";
}

$sql = "select * from table";

if ($res = $mysqli->query($sql))
{
	$rows = array();
	while ($row = $res->fetch_assoc())
	{
	$rows[] = $row;
	}
}
echo json_encode($rows, JSON_PRETTY_PRINT);
?>
