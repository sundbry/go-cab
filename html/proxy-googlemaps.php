<?php

$req = $_GET['req'];
$url = sprintf("https://maps.googleapis.com%s", $req);
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
curl_exec($ch);

?>
