<?php

require('inc/init.php');

$response = array(
	'mode' => 'error',
	'errorLabels' => array(
		'go-datetime-pickup'	
	),
	'errorMessage' => 'Please choose a date and time that has not already passed.'
);

/*
$response = array(
	'mode' => 'ok',
	'continuePost' => 'continuation-000001'
);
*/

echo json_encode($response);

?>
