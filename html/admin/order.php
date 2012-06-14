<?php
require('inc/init.php');
require('inc/header.php');

if(isset($_GET['id'])) {
	$order = CabServiceOrder::load($_GET['id']);
	$request = $order->request();
}
else {
	die('error, no order id');
}

if(!empty($_POST['disposition'])) {

	if(!empty($_POST['message'])) {
		$order->addDispatchMessage($_POST['message']);
	}

	switch($_POST['disposition']) {
		case 'accept-order':
			$order->setEta($_POST['eta']);
			$order->accept();
			break;

		case 'reject-order':
			$order->reject();
			break;
	}

}

?>
<script type="text/javascript">
$(document).ready(function() {
	var dispos = $("input[name=disposition]");
	dispos.change(function() {
		dispos.each(function(idx, node) {
			if(node.checked) {
				if(node.value == 'accept-order') {
					$("#accept-fields").show();
					$("#reject-fields").hide();
				}
				else {
					$("#accept-fields").hide();
					$("#reject-fields").show();
				}
			}
		});
	});
});
</script>
<div id="content">
<h2>Dispatch Order #<?=$order->id;?></h2>
<table class="order">
<?
	switch($order->dispatchStatus()) {
		case 'wait':
			$orderStatus = 'Pending';
			break;
		case 'accept':
		case 'reject':
		default:
			$orderStatus = ucfirst($order->dispatchStatus()).'ed';
			break;
	}
	echo '<tr><td>Status</td><td><strong>', $orderStatus, '</strong></td></tr>
		<tr><td>Phone Number</td><td><a href="tel:+', $request->phoneNumberDigits(), '">', htmlentities($request->phoneNumber()), '</a></td></tr>
		<tr><td>Pick-Up Time</td><td>', $request->pickupDate('M j h:i a'), '</td></tr>
		<tr><td>Pick-Up Address</td><td>', htmlentities($request->pickupAddress()), '</td></tr>
		<tr><td>Destination Address</td><td>', htmlentities($request->destAddress()), '</td></tr>
		<tr><td>Message</td><td>', $request->hasMessage() ? htmlentities($request->message()) : 'None', '</td></tr>';
	if($order->dispatchStatus() == 'accept') {
		echo '<tr><td>ETA</td><td>', htmlentities($order->eta()), '</td></tr>';
	}
?>
</table>

<? if($order->dispatchStatus() == 'wait') { ?>
<hr />

<form method="post" action="order.php?id=<?=$order->id;?>">
	<label for="accept-order">Accept</label> <input type="radio" name="disposition" value="accept-order" />
	<label for="reject-order">Reject</label> <input type="radio" name="disposition" value="reject-order" /><br />
	<label>Message (optional)</label><br />
	<textarea name="message" style="width: 300px; height: 7em;"></textarea><br />
	<div id="accept-fields" style="display: none;">
		<label>ETA</label>
		<input type="text" name="eta" value="<?=$request->pickupDate('h:i a');?>" /><br />
		<br />
		<input type="submit" value="Accept Order" />
	</div>
	<div id="reject-fields" style="display: none;">
		<br />
		<input type="submit" value="Reject Order" />
	</div>
</form>
<? } ?>
</div>
<?
require('inc/footer.php');
?>
