<?php

class CabServiceOffer {

	const REFUSED_UNKNOWN = 0, REFUSED_TRUE = 1, REFUSED_FALSE = 2;

	public $csr, $station, $distance, $refused;

	function __construct(CabServiceRequest $csr, CabServiceStation $station) {
		$this->csr = $csr;
		$this->station = $station;
		$this->refused = self::REFUSED_UNKNOWN;
	}

	function distance() {
		return $this->csr->distance();
	}

	function hasRefused() {
		if($this->refused == self::REFUSED_UNKNOWN) {
			$q = sprintf("SELECT COUNT(*) FROM gc_service_order WHERE csr_id = %d AND css_id = %d AND `status` = 'reject';",
				$this->csr->id, $this->station->id);
			$r = GCConfig::$db->query($q);
			$row = $r->fetch_row();
			$this->refused = $row[0] > 0 ? self::REFUSED_TRUE : self::REFUSED_FALSE;
		}

		return $this->refused == self::REFUSED_TRUE;
	}

	function roundDistance() {
		return sprintf("%.2f", $this->csr->distance());
	}

	function estPrice() {
		return sprintf("%.2f", 3 + $this->csr->distance() * 4.25);
	}

}

?>
