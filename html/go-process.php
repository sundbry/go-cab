<?php

require('inc/init.php');

/* post:
    [go-search-dest] => 1 Grand Ave, San Luis Obispo, CA
    [go-search-pickup] => 1050 Monterey St, San Luis Obispo, CA
    [go-datetime-pickup] => 05/15/2012 08:25 PM
    [go-message-mode] => text
    [go-callback-number] => 
    [go-message-text] => 
*/

$v_geocode = function($val) {
	$val = trim($val);
	return !empty($val) && $val != 'loading' && $val != 'error' ;
};

$validate = new Validate(array(
		'go-search-dest' => VRule::required('Choose your destination address.'),	
		'go-search-dest-gc' => new VRule($v_geocode, 'Unknown destination address geocode.'),	
		'go-search-pickup' => VRule::required('Choose your pick-up location.'),
		'go-search-pickup-gc' => new VRule($v_geocode, 'Unknown pickup address geocode.'),	 
		'go-datetime-pickup' => array(VRule::required('Choose your pick-up time.'),
			VRule::futureDatetime('Please schedule a pick-up time now or in the future.')),
		'go-message-mode' => VRule::required('Message mode required.'),
		'go-callback-number'=> VRule::phone('Please provide your callback number.'),
		'asdf' => VRule::required('lol')
	));

if($validate->run($_POST)) {;
	$csr = CabServiceRequest::create($_POST);
	$response = array(
		'mode' => 'ok',
		'continuePost' => $csr->__toString()
	);
}
else {
	$response = array(
		'mode' => 'error',
		'errorLabels' => array_keys($validate->errors()),
		'errorMessage' => $validate->firstErrorMessage()
	);
}

echo json_encode($response);

?>
