<?php

class LatLng {

	public $lat, $lng, $rlat, $rlng;

	function __construct($lat, $lng) {
		$this->lat = $lat;
		$this->lng = $lng;
		$this->rlat = $lat * M_PI / 180;
		$this->rlng = $lng * M_PI / 180;
	}

	public static function parseGeocode($orderedPair) {
		if(preg_match('/\(([\-\.0-9]+),\s([\-\.0-9]+)\)/', $orderedPair, $matches)) {
			return new LatLng($matches[1], $matches[2]);
		}
		return null;
	}

}

?>
