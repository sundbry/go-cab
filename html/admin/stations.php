<?php
require('inc/init.php');
require('inc/header.php');
?>
<div id="content">
<h2>Service Stations</h2>
<? require('inc/station-menu.php'); ?>
<table border="1">
<tr><th>ID</th><th>Name</th><th>Phone</th><th>Website</th><th>City</th><th>State</th><th>Lat</th><th>Long</th></tr>
<?
foreach(CabServiceStation::activeList() as $station) {
	echo '<tr><td>', $station->id, '</td><td>', htmlentities($station->name()), '</td><td>', $station->phoneNumber(), '</td><td>', htmlentities($station->website()), '</td><td>', $station->city(), '</td><td>', $station->state(), '</td><td>', $station->latitude(), '</td><td>', $station->longitude(), '</td></tr>';
}
?>
</table>
</div>
<?
require('inc/footer.php');
?>
