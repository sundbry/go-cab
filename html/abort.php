<?php

require('inc/init.php');

/* post:
    [order] => order-123
*/

$validate = new Validate(array(
	'order' => VRule::required('Order number missing'),	
));

if($validate->run($_POST) && $order = CabServiceOrder::loadOrder($_POST['order'])) {
	$order->abort();
	$response = array(
		'mode' => 'ok',
	);
}
else {
	$response = array(
		'mode' => 'error',
		'errorMessage' => "Invalid order number"
	);
}

echo json_encode($response);

?>
