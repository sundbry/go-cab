<?php
require('inc/init.php');
require('inc/header.php');

?>
<div id="content">
<h2>Dispatch Orders</h2>
<table border="1" class="dispatch">
<tr><th>Pickup Time</th><th>Pickup Address</th><th>Drop-off Address</th><th>Action</th></tr>
<?
foreach(CabServiceStation::activeList() as $station) {
	echo '<tr><th colspan="4">', htmlentities($station->name()), '</th></tr>';
	$orders = $station->pendingOrders();
	foreach($orders as $order) {
		$request = $order->request();
		echo '<tr><td>', $request->pickupDate('M j h:i a'), '</td><td>', htmlentities($request->pickupAddress()), '</td><td>', htmlentities($request->destAddress()), '</td><td><a href="order.php?id=', $order->id, '">View</a></td></tr>';
	}
	if(empty($orders)) {
		echo '<tr><td colspan="4">No orders</td></tr>';
	}
}
?>
</table>
</div>
<?
require('inc/footer.php');
?>
