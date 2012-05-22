<?php
require('inc/init.php');

function preset($val) {
	return $_POST[$val];
}

$valid = new Validate();
if(!empty($_POST)) {
	$valid->addRules(array(
		'name' => VRule::required('name required'),
		'phone' => array(VRule::required('phone required'),
			VRule::phone('Invalid phone number')),
		'city' => VRule::required('city required'),
		'state' => array(VRule::required('state required'),
			VRule::stateCode('invalid state')),
		'latitude' => array(VRule::required('latitude required'),
			VRule::latitude('bad latitude')),
		'longitude' => array(VRule::required('longitude required'),
			VRule::longitude('bad longitude')),

		'range' => array(VRule::required('range required'),
			VRule::intval('invalid range'))
	));
	if($valid->run($_POST)) {
		CabServiceStation::create($_POST['name'], $_POST['phone'], $_POST['website'],
			$_POST['city'], $_POST['state'], $_POST['latitude'], $_POST['longitude'],
			$_POST['range']);
		header('Location: stations.php');
		exit;
	}
}

require('inc/header.php');
?>
<div id="content">
<h2>Service Stations</h2>
<? require('inc/station-menu.php'); ?>
<?
foreach($valid->errorsList() as $error) {
	echo 'Error: ', $error, '<br />';
}
?>
<form method="post">
	<label for="name">Name</label>
	<input type="text" name="name" value="<?=preset('name');?>" /><br />
	<label for="phone">Phone</label>
	<input type="text" name="phone" value="<?=preset('phone');?>" /><br />
	<label for="website">Website</label>
	<input type="text" name="website" value="<?=preset('website');?>" placeholder="example.com" /><br />
	<label for="city">City</label>
	<input type="text" name="city" value="<?=preset('city');?>" /><br />
	<label for="state">State</label>
	<input type="text" name="state" value="<?=preset('state');?>" /><br />
	<label for="latitude">Latitude</label>
	<input type="text" name="latitude" value="<?=preset('latitude');?>" /><br />
	<label for="longitude" name="longitude">Longitude</label>
	<input type="text" name="longitude" value="<?=preset('longitude');?>" /><br />
	<label for="range">Range</label>
	<input type="text" name="range" value="<?=preset('range');?>" /> mi<br />
	<input type="submit" value="Add Station" />
</form>
</div>
<?
require('inc/footer.php');
?>
