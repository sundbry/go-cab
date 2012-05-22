<?php

class CabServiceOffer {

	public $station, $distance;

	function __construct(CabServiceStation $station, $distance) {
		$this->station = $station;
		$this->distance = $distance;
	}

	function distance() {
		return $this->distance;
	}

	function roundDistance() {
		return sprintf("%.2f", $this->distance);
	}

	function estPrice() {
		return sprintf("%.2f", 3 + $this->distance * 4.25);
	}

}

?>
