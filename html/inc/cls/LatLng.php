<?php

class LatLng {

	public $lat, $lng, $rlat, $rlng;

	function __construct($lat, $lng) {
		$this->lat = $lat;
		$this->lng = $lng;
		$this->rlat = $lat * M_PI / 180;
		$this->rlng = $lng * M_PI / 180;
	}

}

?>
