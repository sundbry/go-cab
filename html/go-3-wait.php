<?php

require('inc/init.php');

/* post:
    [order] => (order code)
*/

define('POLL_TIMEOUT', 25); # wait n seconds for an accept/reject state before returning 'wait'
define('LOOP_INTERVAL', 500); # wait n milliseconds between checks (server side)

$validate = new Validate(array(
	'order' => VRule::required('Order number required.')
));

if($validate->run($_POST) && ($order = CabServiceOrder::loadOrder($_POST['order']))) {
	$timeStart = time();

	while($order->dispatchWaiting(true) && (time() - $timeStart < POLL_TIMEOUT)) {
		usleep(LOOP_INTERVAL * 1000);
	}

	$response = array(
		'mode' => $order->dispatchStatus() # accept, reject, or wait
	);
}
else {
	$response = array(
		'mode' => 'error',
		'errorMessage' => ($validate->hasError() ? $validate->firstErrorMessage() : 'Invalid order')
	);
}

echo json_encode($response);

?>
